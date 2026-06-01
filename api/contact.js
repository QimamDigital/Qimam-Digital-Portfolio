module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ success: false, error: 'Method not allowed' });
  }

  try {
    const {
      name = '',
      phone = '',
      business = '',
      plan = '',
      industry = '',
      message = ''
    } = req.body || {};

    const payload = {
      name: String(name).trim(),
      phone: String(phone).trim(),
      business: String(business).trim(),
      plan: String(plan).trim(),
      industry: String(industry).trim(),
      message: String(message).trim()
    };

    if (!payload.name || !payload.phone || !payload.business || !payload.message) {
      return res.status(400).json({ success: false, error: 'Missing required fields' });
    }

    const apiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL || 'info@qimamdigital.com';

    if (!apiKey) {
      return res.status(500).json({
        success: false,
        error: 'Server email is not configured. Add RESEND_API_KEY in Vercel environment variables.'
      });
    }

    const emailBody = [
      'New website inquiry from Qimam Digital website',
      '',
      'Name:',
      payload.name,
      '',
      'Phone / WhatsApp:',
      payload.phone,
      '',
      'Business:',
      payload.business,
      '',
      'Plan:',
      payload.plan || 'Not specified',
      '',
      'Industry:',
      payload.industry || 'Not specified',
      '',
      'Message:',
      payload.message
    ].join('\n');

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: 'Qimam Digital Website <onboarding@resend.dev>',
        to: [toEmail],
        subject: 'New Website Inquiry',
        text: emailBody,
        reply_to: toEmail
      })
    });

    if (!resendResponse.ok) {
      const details = await resendResponse.text();
      return res.status(502).json({
        success: false,
        error: 'Email provider request failed',
        details
      });
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(500).json({
      success: false,
      error: 'Unexpected server error',
      details: error?.message || 'Unknown error'
    });
  }
};
