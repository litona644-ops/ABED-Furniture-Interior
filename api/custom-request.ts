export default async function handler(req: any, res: any) {
  // Enterprise HTTP Security headers
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  try {
    const { furnitureType, timberType, customDimensions, clientPhone, customNotes } = req.body || {};

    if (!clientPhone || typeof clientPhone !== 'string') {
      return res.status(400).json({ error: 'মোবাইল নম্বর প্রদান করা আবশ্যক।' });
    }

    const cleanPhone = clientPhone.replace(/[^0-9+]/g, '').trim();
    if (cleanPhone.length < 8 || cleanPhone.length > 20) {
      return res.status(400).json({ error: 'সঠিক মোবাইল নম্বর প্রদান করুন।' });
    }

    const cleanFurnitureType = String(furnitureType || 'ফার্নিচার').substring(0, 100);
    const cleanTimberType = String(timberType || 'সেগুন কাঠ').substring(0, 100);
    const cleanDimensions = customDimensions ? String(customDimensions).substring(0, 150) : '';
    const cleanNotes = customNotes ? String(customNotes).substring(0, 500) : '';

    const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;

    // Optional forward via Meta WhatsApp Cloud API if configured
    const whatsappToken = process.env.WHATSAPP_CLOUD_API_TOKEN;
    const whatsappPhoneId = process.env.WHATSAPP_PHONE_NUMBER_ID;

    if (whatsappToken && whatsappPhoneId) {
      try {
        const adminDestPhone = (process.env.WHATSAPP_ADMIN_NUMBER || '8801816234157').replace(/[^0-9]/g, '');
        const messageBody = `*নতুন কাস্টম ফার্নিচার অনুসন্ধান*\n\nআইটেম: ${cleanFurnitureType}\nকাঠ: ${cleanTimberType}\nমাপ: ${cleanDimensions || 'পরামর্শ অনুযায়ী'}\nগ্রাহকের ফোন: ${cleanPhone}\nনোট: ${cleanNotes || 'নাই'}`;

        await fetch(`https://graph.facebook.com/v18.0/${whatsappPhoneId}/messages`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${whatsappToken}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            messaging_product: 'whatsapp',
            recipient_type: 'individual',
            to: adminDestPhone,
            type: 'text',
            text: { body: messageBody }
          })
        });
      } catch (waErr) {
        console.warn('WhatsApp API forward note:', waErr);
      }
    }

    return res.status(200).json({
      success: true,
      requestId,
      message: 'আপনার কাস্টম ফার্নিচারের তথ্য সফলভাবে গ্রহণ করা হয়েছে।'
    });
  } catch (error) {
    return res.status(500).json({ error: 'সার্ভারে অভ্যন্তরীণ সমস্যা দেখা দিয়েছে।' });
  }
}
