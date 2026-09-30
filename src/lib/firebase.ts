import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, signInAnonymously } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import defaultConfig from '../../firebase-applet-config.json';
import { 
  uploadImageToCloudinary, 
  uploadVideoToCloudinary, 
  CLOUDINARY_CONFIG 
} from './cloudinary';

// Support both Vercel environment variables (VITE_FIREBASE_*) and bundled firebase-applet-config.json
const firebaseConfig = {
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || defaultConfig.projectId,
  appId: import.meta.env.VITE_FIREBASE_APP_ID || defaultConfig.appId,
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || defaultConfig.apiKey,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || defaultConfig.authDomain,
  firestoreDatabaseId: import.meta.env.VITE_FIREBASE_DATABASE_ID || defaultConfig.firestoreDatabaseId,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || defaultConfig.storageBucket,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || defaultConfig.messagingSenderId,
};

const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

export const auth = getAuth(app);

// Use initializeFirestore with experimentalAutoDetectLongPolling and ignoreUndefinedProperties
let firestoreInstance;
try {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true, ignoreUndefinedProperties: true }, firebaseConfig.firestoreDatabaseId)
    : initializeFirestore(app, { experimentalAutoDetectLongPolling: true, ignoreUndefinedProperties: true });
} catch {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;

/**
 * Ensures an active Firebase Auth session so that Firestore security rules allow authorized writes.
 */
export async function ensureAuthSession(): Promise<void> {
  if (!auth.currentUser) {
    try {
      await signInWithEmailAndPassword(auth, 'admin@abedfurniture.com', 'abed2026');
    } catch {
      try {
        await signInAnonymously(auth);
      } catch (authErr) {
        console.warn('Auth session note:', authErr);
      }
    }
  }
}

/**
 * Uploads a completed project photo to Cloudinary and returns the public secure URL.
 * Supports JPG, JPEG, PNG, WEBP.
 */
export async function uploadProjectImage(
  file: File, 
  _projectId?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  return await uploadImageToCloudinary(file, onProgress);
}

/**
 * Uploads a completed project video to Cloudinary and returns the public secure URL.
 * Supports MP4 videos (1-2 minutes, up to 100MB).
 */
export async function uploadProjectVideo(
  file: File, 
  _projectId?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  return await uploadVideoToCloudinary(file, onProgress);
}

/**
 * Uploads a product catalog image to Cloudinary and returns the public secure URL.
 * Supports JPG, JPEG, PNG, WEBP.
 */
export async function uploadProductImage(
  file: File, 
  _productId?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  return await uploadImageToCloudinary(file, onProgress);
}

export { CLOUDINARY_CONFIG };

// Verify server connection gracefully without throwing uncaught errors
export async function testConnection() {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
  } catch (error) {
    if (error instanceof Error && (error.message.includes('the client is offline') || error.message.includes('unavailable'))) {
      // Offline fallback is active: Firestore serves from local cache and syncs once connected
    }
  }
}

testConnection();

