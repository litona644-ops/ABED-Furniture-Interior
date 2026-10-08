import { db } from './firebase';
import { 
  collection, 
  doc, 
  setDoc, 
  getDocs, 
  deleteDoc, 
  onSnapshot,
  query,
  orderBy 
} from 'firebase/firestore';

export interface AdminDeviceSession {
  sessionId: string;
  adminEmail: string;
  deviceName: string;
  browser: string;
  os: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
  ip?: string;
  loginAt: string;
  lastActive: string;
  isCurrentDevice?: boolean;
}

export interface AdminAccessInfo {
  maxAllowedAdmins: string;
  concurrentDeviceLimit: string;
  registeredAdmins: {
    name: string;
    email: string;
    role: string;
    accessLevel: string;
    status: string;
  }[];
  activeSessions: AdminDeviceSession[];
}

/**
 * Returns a stable unique session ID for this browser/device.
 */
export function getOrCreateSessionId(): string {
  if (typeof window === 'undefined') return 'server';
  let id = localStorage.getItem('abed_admin_session_id');
  if (!id) {
    id = `session_${Date.now()}_${Math.random().toString(36).substring(2, 9)}`;
    localStorage.setItem('abed_admin_session_id', id);
  }
  return id;
}

/**
 * Parses user-agent for accurate OS, browser, and device classification.
 */
export function getDeviceInfo(): {
  deviceName: string;
  browser: string;
  os: string;
  deviceType: 'Desktop' | 'Mobile' | 'Tablet';
} {
  const ua = typeof navigator !== 'undefined' ? navigator.userAgent : '';
  let os = 'Unknown OS';
  let browser = 'Unknown Browser';
  let deviceType: 'Desktop' | 'Mobile' | 'Tablet' = 'Desktop';

  // Detect OS
  if (/Windows NT 10.0/i.test(ua)) os = 'Windows 10/11';
  else if (/Windows NT/i.test(ua)) os = 'Windows PC';
  else if (/Macintosh|Mac OS X/i.test(ua)) os = 'macOS';
  else if (/Android/i.test(ua)) os = 'Android';
  else if (/iPhone|iPad|iPod/i.test(ua)) os = 'iOS (Apple)';
  else if (/Linux/i.test(ua)) os = 'Linux';

  // Detect Browser
  if (/Edg\//i.test(ua)) browser = 'Microsoft Edge';
  else if (/Chrome\//i.test(ua) && !/Edg\//i.test(ua)) browser = 'Google Chrome';
  else if (/Safari\//i.test(ua) && !/Chrome\//i.test(ua)) browser = 'Apple Safari';
  else if (/Firefox\//i.test(ua)) browser = 'Mozilla Firefox';
  else if (/Opera|OPR\//i.test(ua)) browser = 'Opera';

  // Detect Device Type
  if (/iPad|Tablet/i.test(ua)) {
    deviceType = 'Tablet';
  } else if (/Mobile|Android|iPhone/i.test(ua)) {
    deviceType = 'Mobile';
  } else {
    deviceType = 'Desktop';
  }

  const deviceName = `${browser} on ${os}`;
  return { deviceName, browser, os, deviceType };
}

/**
 * Registers this device/session into Firestore `admin_sessions`.
 */
export async function registerAdminSession(adminEmail: string = 'litona644@gmail.com'): Promise<void> {
  try {
    const sessionId = getOrCreateSessionId();
    const { deviceName, browser, os, deviceType } = getDeviceInfo();
    const now = new Date().toISOString();

    const sessionData: Record<string, any> = {
      sessionId,
      adminEmail: adminEmail || 'litona644@gmail.com',
      deviceName,
      browser,
      os,
      deviceType,
      loginAt: now,
      lastActive: now,
      timestamp: Date.now()
    };

    // Store in local storage for instant offline access
    localStorage.setItem('abed_current_session', JSON.stringify(sessionData));

    // Persist to Firestore
    try {
      await setDoc(doc(db, 'admin_sessions', sessionId), sessionData, { merge: true });
    } catch (fbErr) {
      console.warn('Firestore session register note:', fbErr);
    }
  } catch (err) {
    console.warn('registerAdminSession error:', err);
  }
}

/**
 * Removes current device/session from Firestore upon logout.
 */
export async function terminateAdminSession(): Promise<void> {
  try {
    const sessionId = getOrCreateSessionId();
    localStorage.removeItem('abed_current_session');
    try {
      await deleteDoc(doc(db, 'admin_sessions', sessionId));
    } catch (fbErr) {
      console.warn('Firestore session delete note:', fbErr);
    }
  } catch (err) {
    console.warn('terminateAdminSession error:', err);
  }
}

/**
 * Revokes any specific session by sessionId.
 */
export async function revokeAdminSession(sessionId: string): Promise<void> {
  try {
    await deleteDoc(doc(db, 'admin_sessions', sessionId));
  } catch (e) {
    console.warn('Error revoking session:', e);
  }
}

/**
 * Fetches all active admin sessions from Firestore with local fallback.
 */
export async function fetchActiveAdminSessions(): Promise<AdminDeviceSession[]> {
  const currentSessionId = getOrCreateSessionId();
  const sessions: AdminDeviceSession[] = [];

  try {
    const snap = await getDocs(collection(db, 'admin_sessions'));
    snap.forEach((docSnap) => {
      const data = docSnap.data() as any;
      sessions.push({
        sessionId: docSnap.id,
        adminEmail: data.adminEmail || 'litona644@gmail.com',
        deviceName: data.deviceName || 'Admin Workstation',
        browser: data.browser || 'Browser',
        os: data.os || 'Desktop OS',
        deviceType: data.deviceType || 'Desktop',
        ip: data.ip || '103.xxx.xxx.xxx',
        loginAt: data.loginAt || new Date().toISOString(),
        lastActive: data.lastActive || new Date().toISOString(),
        isCurrentDevice: docSnap.id === currentSessionId
      });
    });
  } catch (e) {
    console.warn('Firestore get admin sessions note:', e);
  }

  // Ensure current device is present
  const hasCurrent = sessions.some(s => s.sessionId === currentSessionId);
  if (!hasCurrent) {
    const info = getDeviceInfo();
    sessions.unshift({
      sessionId: currentSessionId,
      adminEmail: 'litona644@gmail.com',
      deviceName: `${info.deviceName} (বর্তমান ডিভাইস)`,
      browser: info.browser,
      os: info.os,
      deviceType: info.deviceType,
      ip: 'স্বীকৃত নিরাপদ সংযোগ',
      loginAt: new Date().toISOString(),
      lastActive: new Date().toISOString(),
      isCurrentDevice: true
    });
  }

  return sessions;
}
