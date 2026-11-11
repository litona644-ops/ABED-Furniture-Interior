export default async function handler(req: any, res: any) {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');

  const now = Date.now();

  if (req.method === 'GET') {
    return res.json({
      status: 'ok',
      serverTime: now,
      note: 'Firestore site_settings/current is the persistent real-time source of truth'
    });
  }

  return res.status(200).json({ success: true, timestamp: now });
}
