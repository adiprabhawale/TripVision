// src/lib/firebase-admin.ts
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

/**
 * Unified Firebase Admin Safe-Loader
 * 
 * We use eval('require') to bypass Next.js 15 / Turbopack instrumentation
 * which is known to cause prototype-related crashes (Getters/Setters) 
 * during development HMR.
 */
const getAdmin = () => {
  try {
    return eval('require')('firebase-admin');
  } catch (e) {
    console.error('Failed to load firebase-admin. Ensure it is in package.json.');
    throw e;
  }
};

let app: any;

const getApp = () => {
  const admin = getAdmin();
  if (admin.apps.length === 0) {
    const serviceAccount = {
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'),
    };

    app = admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
      databaseURL: `https://${process.env.FIREBASE_PROJECT_ID}.firebaseio.com`,
    });
  } else {
    app = admin.apps[0];
  }
  return app;
};

export const getAdminAuth = async (): Promise<Auth> => {
  return getAdmin().auth(getApp());
};

export const getAdminDb = async (): Promise<Firestore> => {
  return getAdmin().firestore(getApp());
};

export const getFieldValue = async () => {
  return getAdmin().firestore.FieldValue;
};
