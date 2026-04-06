import * as admin from 'firebase-admin';

// Initialize the Admin SDK
if (!admin.apps.length) {
  admin.initializeApp();
}

export const getAdminDb = () => {
  return admin.firestore();
};

export const getAdminAuth = () => {
  return admin.auth();
};

export const getFieldValue = () => {
  return admin.firestore.FieldValue;
};
