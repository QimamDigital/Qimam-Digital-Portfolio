import test from 'node:test'
import assert from 'node:assert/strict'
import { createInquiryServer } from './inquiry.mjs'
import { validateInquiry, inquiryProducts, selectedProduct } from './inquiry-schema.mjs'

const valid = { name: 'أحمد داود', phone: '+962 79 123 4567', product: 'greenhouse-film', lang: 'ar' }
const origin = 'https://www.daoudco.jo'
async function setup(t, overrides = {}) {
  const calls = []
  const server = createInquiryServer({ apiKey: 'test-key', from: 'DAOUDCO <inquiries@example.com>', allowedOrigins: [origin], fetchImpl: async (...args) => { calls.push(args); return { ok: true, json: async () => ({ id: 'fake-only' }) } }, ...overrides })
  await new Promise(resolve => server.listen(0, '127.0.0.1', resolve))
  t.after(() => new Promise(resolve => { server.close(resolve); server.closeAllConnections() }))
  const url = `http://127.0.0.1:${server.address().port}/api/inquiry`
  const send = (body = valid, headers = {}) => fetch(url, { method: 'POST', headers: { 'Content-Type': 'application/json', Origin: origin, ...headers }, body: JSON.stringify(body) })
  return { server, calls, send, url }
}
test('schema: exactly seven categories; preselection accepts only product slugs', () => {
  assert.equal(inquiryProducts.length, 7)
  assert.equal(selectedProduct('greenhouse-film'), 'greenhouse-film')
  assert.equal(selectedProduct('Greenhouse Film'), '')
  assert.equal(selectedProduct('drip-irrigation-pipes'), '')
})
test('schema: required values, Arabic digits, optional email and field limits', () => {
  assert.equal(validateInquiry(valid).ok, true)
  assert.equal(validateInquiry({ ...valid, phone: '٠٧٩١٢٣٤٥٦٧' }).ok, true)
  for (const patch of [{name:' '}, {phone:'abc'}, {phone:'123'}, {email:'bad@'}, {product:'unknown'}, {message:'x'.repeat(4001)}, {name:'x'.repeat(101)}, {website:'spam'}, {business:42}, {name:'a\nb'}]) assert.equal(validateInquiry({...valid,...patch}).ok, false, JSON.stringify(patch).slice(0,100))
})
test('sends only to fixed recipient, using text and optional reply_to', async t => {
  const { send, calls } = await setup(t)
  const response = await send({...valid,email:'buyer@example.org',to:'attacker@example.org',message:'<script>test</script>'})
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), {ok:true})
  assert.equal(calls.length, 1)
  const [url, options] = calls[0]
  assert.equal(url, 'https://api.resend.com/emails')
  const body = JSON.parse(options.body)
  assert.deepEqual(body.to, ['info@daoudco.jo'])
  assert.equal(body.reply_to, 'buyer@example.org')
  assert.match(body.text, /أحمد داود/)
  assert.equal(body.html, undefined)
})
test('missing credentials never pretends success', async t => {
  const {send,calls} = await setup(t,{apiKey:''})
  assert.equal((await send()).status,503)
  assert.equal(calls.length,0)
})
test('provider rejection and network failure are safe errors', async t => {
  for (const fetchImpl of [async()=>({ok:false}),async()=>{throw Error('SECRET provider failure')}]) {
    const {send} = await setup(t,{fetchImpl})
    const result=await send()
    assert.equal(result.status,502)
    assert.doesNotMatch(await result.text(),/SECRET/)
  }
})
test('blocks invalid fields, honeypot and foreign/missing origin before delivery', async t => {
  const {send,calls}=await setup(t)
  assert.equal((await send({...valid,phone:''})).status,400)
  assert.equal((await send({...valid,website:'bot'})).status,400)
  assert.equal((await send(valid,{Origin:'https://evil.example'})).status,403)
  assert.equal((await send(valid,{Origin:''})).status,403)
  assert.equal(calls.length,0)
})
test('enforces content type, body size, method and JSON', async t=>{
  const {url,send,calls}=await setup(t)
  assert.equal((await fetch(url)).status,405)
  assert.equal((await send(valid,{'Content-Type':'text/plain'})).status,415)
  assert.equal((await send({...valid,message:'x'.repeat(20000)})).status,413)
  assert.equal((await fetch(url,{method:'POST',headers:{Origin:origin,'Content-Type':'application/json'},body:'{broken'})).status,400)
  assert.equal(calls.length,0)
})
test('rate limit uses socket address, not spoofable forwarded header', async t=>{
  const {send}=await setup(t,{rateLimit:2})
  assert.equal((await send(valid,{'X-Forwarded-For':'1.1.1.1'})).status,200)
  assert.equal((await send(valid,{'X-Forwarded-For':'2.2.2.2'})).status,200)
  const result=await send(valid,{'X-Forwarded-For':'3.3.3.3'})
  assert.equal(result.status,429)
  assert.ok(result.headers.get('retry-after'))
})
test('concurrent identical inquiries cannot send twice', async t=>{
  let release, started
  const pending=new Promise(resolve=>{release=resolve})
  const entered=new Promise(resolve=>{started=resolve})
  let count=0
  const {send}=await setup(t,{fetchImpl:async()=>{count++;started();await pending;return {ok:true,json:async()=>({id:'fake'})}}})
  const first=send()
  await entered
  const second=await send()
  assert.equal(second.status,409)
  release()
  assert.equal((await first).status,200)
  assert.equal(count,1)
})
