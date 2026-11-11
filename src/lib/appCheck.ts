import { app } from './firebase';
import { initializeAppCheck, ReCaptchaV3Provider, AppCheck } from 'firebase/app-check';

let appCheckInstance: AppCheck | null = null;

/**
 * Initializes Firebase App Check with ReCaptchaV3Provider.
 * If reCAPTCHA site key is not configured, logs a helpful security notice without breaking the application.
 */
export function initAppCheck(): AppCheck | null {
  if (typeof window === 'undefined') return null;
  if (appCheckInstance) return appCheckInstance;

  try {
    const siteKey = (import.meta as any).env?.VITE_RECAPTCHA_SITE_KEY;
    const isDev = (import.meta as any).env?.DEV;

    if (!siteKey) {
      if (isDev) {
        console.info('[Security Note] Firebase App Check: VITE_RECAPTCHA_SITE_KEY is not set. App Check disabled for local development.');
      }
      return null;
    }

    // In development mode, enable debug token for testing
    if (isDev && typeof window !== 'undefined') {
      (window as any).FIREBASE_APPCHECK_DEBUG_TOKEN = true;
    }

    appCheckInstance = initializeAppCheck(app, {
      provider: new ReCaptchaV3Provider(siteKey),
      isTokenAutoRefreshEnabled: true
    });

    console.info('[Security] Firebase App Check initialized successfully with reCAPTCHA v3.');
    return appCheckInstance;
  } catch (err) {
    console.warn('[Security] Firebase App Check initialization note:', err);
    return null;
  }
}
