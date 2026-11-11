import express, { Request, Response, NextFunction } from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const isProduction = process.env.NODE_ENV === 'production';

// 1. Strict HTTP Security Headers
app.use((_req: Request, res: Response, next: NextFunction) => {
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'SAMEORIGIN');
  res.setHeader('X-XSS-Protection', '1; mode=block');
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('Permissions-Policy', 'camera=(), microphone=(), geolocation=()');
  if (isProduction) {
    res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains');
  }
  next();
});

// 2. Body Size Restrictions (500KB to prevent payload flooding)
app.use(express.json({ limit: '500kb' }));
app.use(express.urlencoded({ extended: false, limit: '500kb' }));

// 3. In-memory Rate Limiting for API routes
interface RateBucket {
  count: number;
  resetTime: number;
}
const rateLimitStore = new Map<string, RateBucket>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30; // Max 30 requests per minute per IP

const apiRateLimiter = (req: Request, res: Response, next: NextFunction) => {
  const ip = (req.headers['x-forwarded-for'] as string)?.split(',')[0].trim() || req.socket.remoteAddress || 'unknown';
  const now = Date.now();
  const bucket = rateLimitStore.get(ip);

  if (!bucket || now > bucket.resetTime) {
    rateLimitStore.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW_MS });
    return next();
  }

  if (bucket.count >= MAX_REQUESTS_PER_WINDOW) {
    return res.status(429).json({
      error: 'Too Many Requests',
      message: 'অনুরোধের সীমা অতিক্রম করেছে। অনুগ্রহ করে ১ মিনিট পর আবার চেষ্টা করুন।'
    });
  }

  bucket.count++;
  next();
};

// Clean expired rate limit buckets periodically
setInterval(() => {
  const now = Date.now();
  for (const [ip, bucket] of rateLimitStore.entries()) {
    if (now > bucket.resetTime) {
      rateLimitStore.delete(ip);
    }
  }
}, 5 * 60 * 1000);

// 4. API Endpoints
const apiRouter = express.Router();
apiRouter.use(apiRateLimiter);

// Health check endpoint
apiRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'ok',
    securityHardened: true,
    timestamp: new Date().toISOString()
  });
});

// Custom Furniture Order Submission Endpoint
apiRouter.post('/custom-request', async (req: Request, res: Response) => {
  try {
    const { furnitureType, timberType, customDimensions, clientPhone, customNotes } = req.body;

    // Strict input validation & sanitization
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
    const record = {
      id: requestId,
      furnitureType: cleanFurnitureType,
      timberType: cleanTimberType,
      customDimensions: cleanDimensions,
      clientPhone: cleanPhone,
      customNotes: cleanNotes,
      createdAt: new Date().toISOString(),
      timestamp: Date.now(),
      status: 'new'
    };

    // If Meta WhatsApp Cloud API credentials are provided on the server, forward notification
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
        console.warn('[WhatsApp Cloud API Forward Note]:', waErr);
      }
    }

    return res.status(200).json({
      success: true,
      requestId,
      message: 'আপনার কাস্টম ফার্নিচারের তথ্য সফলভাবে গ্রহণ করা হয়েছে।'
    });
  } catch (err: any) {
    console.error('custom-request error:', err);
    return res.status(500).json({ error: 'সার্ভারে অভ্যন্তরীণ ত্রুটি হয়েছে।' });
  }
});

// Server-side Gemini AI Endpoint
apiRouter.post('/gemini/generate', async (req: Request, res: Response) => {
  try {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ error: 'Gemini API সার্ভিস কনফিগার করা নেই।' });
    }

    const { prompt } = req.body;
    if (!prompt || typeof prompt !== 'string') {
      return res.status(400).json({ error: 'সঠিক প্রম্পট প্রদান করুন।' });
    }

    // Limit prompt length to prevent token abuse
    const cleanPrompt = prompt.substring(0, 1500);

    const ai = new GoogleGenAI({ apiKey });
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: cleanPrompt
    });

    return res.json({
      success: true,
      text: response.text || ''
    });
  } catch (err: any) {
    console.error('gemini/generate error:', err);
    return res.status(500).json({ error: 'AI সার্ভিস পরিচালনায় ত্রুটি হয়েছে।' });
  }
});

// ==========================================
// Scheduled Website Lockdown Backend State
// ==========================================
interface ServerLockdownState {
  isLocked: boolean;
  lockdownMode: 'manual' | 'scheduled' | 'off';
  lockdownStartAt: number | null;
  lockdownEndAt: number | null;
  lockdownDuration: string;
  updatedAt: number;
  lockdownId: string;
}

let serverLockdownState: ServerLockdownState = {
  isLocked: false,
  lockdownMode: 'off',
  lockdownStartAt: null,
  lockdownEndAt: null,
  lockdownDuration: '',
  updatedAt: Date.now(),
  lockdownId: ''
};

// Periodic server-side expiration checker (evaluates every 10 seconds)
setInterval(() => {
  if (serverLockdownState.isLocked && serverLockdownState.lockdownMode === 'scheduled' && serverLockdownState.lockdownEndAt) {
    if (Date.now() >= serverLockdownState.lockdownEndAt) {
      console.log(`[Scheduled Lockdown System] Lockdown (${serverLockdownState.lockdownId}) duration expired. Auto-unlocking server state.`);
      serverLockdownState.isLocked = false;
      serverLockdownState.lockdownMode = 'off';
      serverLockdownState.lockdownEndAt = null;
      serverLockdownState.updatedAt = Date.now();
    }
  }
}, 10 * 1000);

// Public Lockdown Status Endpoint (accessible by visitors & devices)
apiRouter.get('/lockdown-status', (_req: Request, res: Response) => {
  const now = Date.now();
  let isEffective = serverLockdownState.isLocked;

  // Auto-expire on request if scheduled time elapsed
  if (isEffective && serverLockdownState.lockdownMode === 'scheduled' && serverLockdownState.lockdownEndAt) {
    if (now >= serverLockdownState.lockdownEndAt) {
      isEffective = false;
      serverLockdownState.isLocked = false;
      serverLockdownState.lockdownMode = 'off';
      serverLockdownState.lockdownEndAt = null;
      serverLockdownState.updatedAt = now;
    }
  }

  const remainingMs = serverLockdownState.lockdownEndAt ? Math.max(0, serverLockdownState.lockdownEndAt - now) : 0;

  res.json({
    isLocked: isEffective,
    lockdownMode: serverLockdownState.lockdownMode,
    lockdownEndAt: serverLockdownState.lockdownEndAt,
    lockdownDuration: serverLockdownState.lockdownDuration,
    remainingMs,
    isExpired: serverLockdownState.lockdownEndAt ? now >= serverLockdownState.lockdownEndAt : false,
    serverTime: now
  });
});

// Admin Lockdown Control Endpoint
apiRouter.post('/admin/lockdown', (req: Request, res: Response) => {
  const { action, durationMs, durationValue, lockdownId } = req.body || {};
  const now = Date.now();

  if (action === 'schedule') {
    const validMs = Number(durationMs);
    if (!validMs || validMs <= 0 || validMs > 7 * 24 * 60 * 60 * 1000) {
      return res.status(400).json({ error: 'সঠিক লকডাউন সময়সীমা নির্বাচন করুন।' });
    }

    serverLockdownState = {
      isLocked: true,
      lockdownMode: 'scheduled',
      lockdownStartAt: now,
      lockdownEndAt: now + validMs,
      lockdownDuration: durationValue || '',
      updatedAt: now,
      lockdownId: lockdownId || `lock_${now}`
    };

    console.log(`[Scheduled Lockdown System] Scheduled lockdown activated until ${new Date(serverLockdownState.lockdownEndAt!).toISOString()}`);

    return res.json({
      success: true,
      state: serverLockdownState,
      message: 'লকডাউন সফলভাবে নির্ধারিত হয়েছে।'
    });
  }

  if (action === 'manual') {
    serverLockdownState = {
      isLocked: true,
      lockdownMode: 'manual',
      lockdownStartAt: now,
      lockdownEndAt: null,
      lockdownDuration: '',
      updatedAt: now,
      lockdownId: `manual_${now}`
    };

    return res.json({
      success: true,
      state: serverLockdownState,
      message: 'ম্যানুয়াল পার্মানেন্ট লকডাউন চালু হয়েছে।'
    });
  }

  if (action === 'unlock') {
    serverLockdownState = {
      isLocked: false,
      lockdownMode: 'off',
      lockdownStartAt: null,
      lockdownEndAt: null,
      lockdownDuration: '',
      updatedAt: now,
      lockdownId: ''
    };

    console.log('[Scheduled Lockdown System] Administrator manually unlocked the website.');

    return res.json({
      success: true,
      state: serverLockdownState,
      message: 'ওয়েবসাইট অবিলম্বে লাইভ করা হয়েছে।'
    });
  }

  return res.status(400).json({ error: 'Invalid action' });
});

app.use('/api', apiRouter);

// 5. Development with Vite middleware or Production Static Serving
async function initServer() {
  if (!isProduction) {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, host: '0.0.0.0', port: PORT },
      appType: 'spa'
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Abed Furniture Server] Running securely on port ${PORT} (mode: ${isProduction ? 'production' : 'development'})`);
  });
}

initServer().catch((err) => {
  console.error('Fatal Server Boot Error:', err);
  process.exit(1);
});
