# DAOUDCO Website Redesign

Modern bilingual React/Vite website for DAOUDCO — Agricultural Polyethylene Film Manf. Co.

## Technology used

- React
- Vite
- JavaScript
- React Router
- Plain modern CSS
- Playwright QA scripts for local inspection
- No backend, database, CMS, authentication, analytics, or tracking cookies

## Project structure

- `src/data/company.js` — company identity, contact details, WhatsApp, hours, social placeholders, manufacturing and why-choose pillars.
- `src/data/products.js` — central product catalogue. All product pages and dropdowns read from this file.
- `src/content.js` — basic English/Arabic UI labels and Arabic product summaries.
- `src/components/` — shared header, footer, product selector, contact form, SEO helper, floating WhatsApp.
- `src/pages/` — Home, About, Products, Product Detail, Manufacturing, Applications, Gallery, Customers, Contact.
- `src/styles/site.css` — full visual system and responsive styling.
- `public/images/daoudco/` — retrieved Daoudco website images.
- `public/documents/` — retrieved technical files from old website.
- `OLD_SITE_CONTENT_AUDIT.md` — content inventory and migration notes.
- `IMAGE_SOURCES.md` — image/document sources and replacement recommendations.

## Installation

```bash
npm install
```

## Run locally

```bash
npm run dev -- --port 5178
```

Local URL used during QA:

```text
http://127.0.0.1:5178/
```

## Production build

```bash
npm run build
```

The build outputs to `dist/`.

## How products are stored

All products live in `src/data/products.js`. Each product supports:

- `id`
- `slug`
- `name`
- `arName`
- `image`
- `shortDescription`
- `description`
- `applications`
- `features`
- `variations`
- `specifications`
- `additives`
- `technicalDocuments`
- `seo`

The homepage selector, products page, individual product pages, applications page, and contact dropdown all read from this central data structure.

## How company data is stored

Edit `src/data/company.js` for:

- Company name
- Arabic company name
- Founded year
- Email
- Phone
- WhatsApp
- Fax
- Address / P.O. Box
- Working hours
- Social links
- Manufacturing capability statements
- Why Choose Us pillars

## How to add or edit products

Edit the relevant object in `src/data/products.js`.

To add a product:

1. Add a new object to the `products` array.
2. Give it a unique `slug`.
3. Add an image under `public/images/daoudco/`.
4. Add specifications and variations only if verified.
5. The contact dropdown and product listings update automatically.

## How to replace photographs

1. Add the new image to `public/images/daoudco/`.
2. Update the relevant `image` field in `src/data/products.js` or page/gallery image list.
3. Update `IMAGE_SOURCES.md` with filename, source, type, usage, and replacement note.

## How to add a product PDF

1. Put the PDF in `public/documents/`.
2. In `src/data/products.js`, add:

```js
technicalDocuments: [
  {
    title: 'Greenhouse Film Technical Data Sheet',
    file: '/documents/greenhouse-film.pdf'
  }
]
```

The product page will automatically show a download/open card.

## How to edit English

Most English product content is in `src/data/products.js` and `src/data/company.js`. Page-level copy is in `src/pages/`.

## How to edit Arabic

Basic UI labels are in `src/content.js`. Arabic product names are in `src/data/products.js` as `arName`. Arabic summaries are in `src/content.js`.

For full production Arabic copy, expand the central localization structure rather than hardcoding separate Arabic pages.

## How the mailto form works

The contact form validates required fields:

- Name
- Phone / WhatsApp

On submit it builds:

- To: `info@daoudco.jo`
- Subject: `DAOUDCO Product Inquiry – [Customer or Business Name]`
- Body with all form fields

It URL-encodes the subject and body, then opens the visitor’s default email client with `mailto:`. It does not send email automatically.

## How WhatsApp works

WhatsApp uses the verified old-site link number from the old header:

`https://wa.me/96264725003`

The helper is in `src/utils/contact.js`. Product pages generate product-specific prefilled messages.

## How to add Instagram, Facebook, or LinkedIn

Edit `src/data/company.js`:

```js
socials: {
  instagram: 'https://instagram.com/...',
  facebook: 'https://facebook.com/...',
  linkedin: 'https://linkedin.com/company/...'
}
```

Only add official verified URLs.

## Analytics and pixels

No analytics IDs or Meta Pixel are installed.

Future hooks can use `trackEvent` in `src/utils/contact.js`. Suggested future events:

- `whatsapp_click`
- `phone_click`
- `email_click`
- `quote_started`
- `quote_submitted`
- `product_view`
- `pdf_download`

Add privacy/cookie consent only when real tracking tools are enabled.

## Deployment instructions

1. Run `npm install`.
2. Run `npm run build`.
3. Upload the contents of `dist/` to the web host.
4. Configure hosting rewrite/fallback to `index.html` for React Router paths like `/products/greenhouse-film`.
5. Verify `/robots.txt` and `/sitemap.xml` are reachable.
6. Test contact links, WhatsApp links, and product pages after deployment.

## QA commands used

```bash
npm run build
npm run dev -- --port 5178
node qa-check.mjs
node qa-form.mjs
```
