import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth, signInAnonymously } from 'firebase/auth';
import { initializeFirestore, getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import { 
  getStorage, 
  ref, 
  uploadBytesResumable, 
  getDownloadURL,
  type FirebaseStorage
} from 'firebase/storage';
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

/**
 * Ensures an active Firebase Auth session so that Firebase Storage and Firestore
 * security rules (which require request.auth != null) allow the write operation.
 */
export async function ensureAuthSession(): Promise<void> {
  if (!auth.currentUser) {
    try {
      await signInAnonymously(auth);
    } catch (authErr) {
      console.warn('Anonymous auth note (proceeding with existing session):', authErr);
    }
  }
}

/**
 * Get or initialize Firebase Storage instance.
 * Supports primary bucket and alternate bucket fallback.
 */
const primaryBucket = firebaseConfig.storageBucket || 'abed-furniture-interior.firebasestorage.app';
const alternateBucket = primaryBucket.endsWith('.firebasestorage.app')
  ? primaryBucket.replace('.firebasestorage.app', '.appspot.com')
  : primaryBucket.replace('.appspot.com', '.firebasestorage.app');

export function getStorageInstance(bucketName?: string): FirebaseStorage {
  const targetBucket = bucketName || primaryBucket;
  return getStorage(app, targetBucket ? `gs://${targetBucket}` : undefined);
}

export const storage = getStorageInstance();

/**
 * Parses Firebase Storage error codes into clear, human-readable messages.
 */
function formatStorageError(err: any): Error {
  const code = err?.code || '';
  const message = err?.message || '';

  if (code === 'storage/bucket-not-found' || code === 'storage/object-not-found' || message.includes('404') || err?.status_ === 404) {
    return new Error(
      'Firebase Cloud Storage বালতি (Bucket) সক্রিয় নেই বা পাওয়া যায়নি। অনুগ্রহ করে Firebase Console (https://console.firebase.google.com) এ গিয়ে আপনার প্রজেক্টের "Build > Storage" এ ঢুকে "Get Started" বাটনে ক্লিক করে স্টোরেজ সক্রিয় করুন।'
    );
  }
  if (code === 'storage/unauthorized' || err?.status_ === 403) {
    return new Error(
      'ফাইল আপলোড করার অনুমতি নেই (Firebase Storage Rules দ্বারা প্রত্যাখ্যাত)। নিশ্চিত করুন যে আপনি এডমিন হিসেবে লগইন আছেন এবং Storage Rules আপডেট করা হয়েছে।'
    );
  }
  if (code === 'storage/quota-exceeded') {
    return new Error('Firebase Storage এর স্টোরেজ কোটা পূর্ণ হয়ে গেছে।');
  }
  if (code === 'storage/retry-limit-exceeded' || code === 'storage/canceled') {
    return new Error('নেটওয়ার্ক সংযোগ সমস্যার কারণে আপলোড সম্পন্ন হতে পারেনি। অনুগ্রহ করে পুনরায় চেষ্টা করুন।');
  }
  if (code === 'storage/invalid-checksum') {
    return new Error('ফাইল আপলোডে ত্রুটি দেখা দিয়েছে (Invalid Checksum)। ফাইলটি পুনরায় সিলেক্ট করে আপলোড করুন।');
  }

  return new Error(message || 'ফাইল আপলোডে সমস্যা হয়েছে। অনুগ্রহ করে ইন্টারনেট ও ফায়ারবেস কনফিগারেশন যাচাই করুন।');
}

/**
 * Core upload function: uploads directly to Firebase Storage using uploadBytesResumable,
 * tracks live progress, retrieves download URL, and rejects with actionable error messages.
 */
export async function uploadFileToStorage(
  file: File,
  storagePath: string,
  contentType: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  await ensureAuthSession();

  // Helper to execute upload task on a specific storage bucket
  const executeUpload = (storageObj: FirebaseStorage): Promise<string> => {
    return new Promise((resolve, reject) => {
      const storageRef = ref(storageObj, storagePath);
      const metadata = {
        contentType: contentType || file.type || 'application/octet-stream',
      };

      const uploadTask = uploadBytesResumable(storageRef, file, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          if (snapshot.totalBytes > 0) {
            const percent = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
            if (onProgress) {
              onProgress(Math.min(100, Math.max(0, percent)));
            }
          }
        },
        (error) => {
          reject(error);
        },
        async () => {
          try {
            const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
            if (onProgress) onProgress(100);
            resolve(downloadUrl);
          } catch (urlError) {
            reject(urlError);
          }
        }
      );
    });
  };

  try {
    // Attempt 1: Upload to primary bucket
    const primaryStorage = getStorageInstance(primaryBucket);
    return await executeUpload(primaryStorage);
  } catch (err1: any) {
    // If bucket was 404, try the alternate bucket format (.appspot.com vs .firebasestorage.app)
    const isNotFound = err1?.code === 'storage/bucket-not-found' || 
                       err1?.code === 'storage/object-not-found' || 
                       err1?.status_ === 404 ||
                       (err1?.message && err1.message.includes('404'));

    if (isNotFound && alternateBucket && alternateBucket !== primaryBucket) {
      console.warn(`Primary storage bucket "${primaryBucket}" returned 404, trying alternate bucket "${alternateBucket}"...`);
      try {
        const altStorage = getStorageInstance(alternateBucket);
        return await executeUpload(altStorage);
      } catch (err2: any) {
        console.error('Alternate storage bucket upload failed:', err2);
        throw formatStorageError(err2);
      }
    }

    console.error('Firebase Storage upload failed:', err1);
    throw formatStorageError(err1);
  }
}

/**
 * Uploads a completed project photo to Firebase Storage and returns the public download URL.
 */
export async function uploadProjectImage(
  file: File, 
  projectId?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `completed_projects/photos/${projectId || 'project'}_${timestamp}_${safeName}`;
  const contentType = file.type || 'image/jpeg';
  return await uploadFileToStorage(file, path, contentType, onProgress);
}

/**
 * Uploads a completed project video to Firebase Storage and returns the public download URL.
 */
export async function uploadProjectVideo(
  file: File, 
  projectId?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `completed_projects/videos/${projectId || 'project'}_${timestamp}_${safeName}`;
  const contentType = file.type || 'video/mp4';
  return await uploadFileToStorage(file, path, contentType, onProgress);
}

/**
 * Uploads a product catalog image to Firebase Storage and returns the public download URL.
 */
export async function uploadProductImage(
  file: File, 
  productId?: string,
  onProgress?: (percent: number) => void
): Promise<string> {
  const timestamp = Date.now();
  const safeName = file.name.replace(/[^a-zA-Z0-9.-]/g, '_');
  const path = `products/${productId || 'product'}_${timestamp}_${safeName}`;
  const contentType = file.type || 'image/jpeg';
  return await uploadFileToStorage(file, path, contentType, onProgress);
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
