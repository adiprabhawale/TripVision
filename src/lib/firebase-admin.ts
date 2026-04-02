// src/lib/firebase-admin.ts
import * as admin from 'firebase-admin';
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

/**
 * Standard Firebase Admin Loader for Next.js 15
 * 
 * We use a standard import because 'firebase-admin' is listed in 
 * 'serverExternalPackages' in next.config.ts. This ensures it is 
 * correctly traced for production on Vercel while avoiding 
 * prototype-related HMR crashes in development.
 */
if (!admin.apps.length) {
  try {
    const projectId = process.env.FIREBASE_PROJECT_ID;
    const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
    const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n');

    if (!projectId || !clientEmail || !privateKey) {
      console.warn('Firebase Admin credentials missing. Admin SDK may not function correctly.');
    }

    admin.initializeApp({
      credential: admin.credential.cert({
        projectId,
        clientEmail,
        privateKey,
      }),
      databaseURL: `https://${projectId}.firebaseio.com`,
    });
  } catch (error) {
    console.error('Error initializing Firebase Admin SDK:', error);
  }
}

export const getAdminAuth = async (): Promise<Auth> => {
  return admin.auth();
};

export const getAdminDb = async (): Promise<Firestore> => {
  return admin.firestore();
};

export const getFieldValue = async () => {
  return admin.firestore.FieldValue;
};
