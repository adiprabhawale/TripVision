// src/lib/firebase-admin-bridge-v3.ts
import * as admin from 'firebase-admin';

let app: admin.app.App;

function getAdminApp() {
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
    app = admin.apps[0]!;
  }
  return app;
}

export function getAdminAuth() {
    return admin.auth(getAdminApp());
}

export function getAdminDb() {
    return admin.firestore(getAdminApp());
}

export function getFieldValue() {
    return admin.firestore.FieldValue;
}
