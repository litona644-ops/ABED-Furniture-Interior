import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import defaultConfig from '../../firebase-applet-config.json';

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

// Use initializeFirestore with experimentalAutoDetectLongPolling for reliable iframe and proxy networking
let firestoreInstance;
try {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? initializeFirestore(app, { experimentalAutoDetectLongPolling: true }, firebaseConfig.firestoreDatabaseId)
    : initializeFirestore(app, { experimentalAutoDetectLongPolling: true });
} catch {
  firestoreInstance = firebaseConfig.firestoreDatabaseId
    ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
    : getFirestore(app);
}

export const db = firestoreInstance;

// Safely initialize Firebase Storage on demand without crashing app startup
let storageInstance: any = null;
let storageInitialized = false;

export function getStorageSafe() {
  if (storageInitialized) return storageInstance;
  storageInitialized = true;
  try {
    storageInstance = getStorage(app);
  } catch (err) {
    console.warn('Firebase Storage is not available or not configured in this project:', err);
    storageInstance = null;
  }
  return storageInstance;
}

/**
 * Compresses an image file to an optimized base64 data URL
 */
export async function compressImage(file: File, maxWidth = 900, quality = 0.75): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        let width = img.width;
        let height = img.height;
        if (width > maxWidth) {
          height = Math.round((height * maxWidth) / width);
          width = maxWidth;
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext('2d');
        if (!ctx) {
          resolve(e.target?.result as string);
          return;
        }
        ctx.drawImage(img, 0, 0, width, height);
        try {
          const dataUrl = canvas.toDataURL('image/webp', quality);
          resolve(dataUrl);
        } catch {
          resolve(canvas.toDataURL('image/jpeg', quality));
        }
      };
      img.onerror = (err) => reject(err);
      img.src = e.target?.result as string;
    };
    reader.onerror = (err) => reject(err);
    reader.readAsDataURL(file);
  });
}

/**
 * Uploads an image file to Firebase Storage with automatic fallback
 */
export async function uploadProductImage(file: File, productId?: string): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `products/${productId || 'new'}_${timestamp}_${safeName}`;
  
  const storageRefInstance = getStorageSafe();
  if (storageRefInstance) {
    try {
      const storageRef = ref(storageRefInstance, path);
      const metadata = {
        contentType: file.type || 'image/jpeg',
      };
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (storageError) {
      console.warn('Firebase Storage upload note (using optimized compression fallback):', storageError);
    }
  }

  // Graceful fallback to client-side compressed webp/jpeg data URL
  return await compressImage(file);
}

/**
 * Uploads a completed project photo to Firebase Storage with automatic fallback
 */
export async function uploadProjectImage(file: File, projectId?: string): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `completed_projects/photos/${projectId || 'new'}_${timestamp}_${safeName}`;
  
  const storageRefInstance = getStorageSafe();
  if (storageRefInstance) {
    try {
      const storageRef = ref(storageRefInstance, path);
      const metadata = {
        contentType: file.type || 'image/jpeg',
      };
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (storageError) {
      console.warn('Firebase Storage image upload fallback:', storageError);
    }
  }

  // Graceful fallback to client-side compressed webp/jpeg data URL
  return await compressImage(file, 1400, 0.82);
}

/**
 * Uploads a completed project video to Firebase Storage with automatic fallback
 */
export async function uploadProjectVideo(
  file: File, 
  projectId?: string
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `completed_projects/videos/${projectId || 'new'}_${timestamp}_${safeName}`;

  const storageRefInstance = getStorageSafe();
  if (storageRefInstance) {
    try {
      const storageRef = ref(storageRefInstance, path);
      const metadata = {
        contentType: file.type || 'video/mp4',
      };
      const snapshot = await uploadBytes(storageRef, file, metadata);
      const downloadUrl = await getDownloadURL(snapshot.ref);
      return downloadUrl;
    } catch (storageError) {
      console.warn('Firebase Storage video upload error:', storageError);
    }
  }

  // Fallback for smaller videos if storage isn't activated in Firebase Console
  if (file.size <= 15 * 1024 * 1024) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = (err) => reject(err);
      reader.readAsDataURL(file);
    });
  }

  throw new Error('ভিডিও ফাইলটি ১৫MB এর বেশি এবং ক্লাউড স্টোরেজ আনভেলেবল। অনুগ্রহ করে ১৫MB এর নিচের ভিডিও সিলেক্ট করুন বা ভিডিও লিংক ব্যবহার করুন।');
}

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
