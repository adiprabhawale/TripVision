// src/lib/firebase-admin.ts
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

// We use a CommonJS bridge to bypass Turbopack/Next.js 15 prototype errors
// with firebase-admin. This is the most stable way to load it in SSR.
// v4: Lazy-load INSIDE getters to prevent evaluation during SSR setup.
const getBridge = async () => {
    return import('./firebase-admin-bridge-v3');
};

export const getAdminAuth = async (): Promise<Auth> => {
    const bridge = await getBridge();
    return bridge.getAdminAuth();
};

export const getAdminDb = async (): Promise<Firestore> => {
    const bridge = await getBridge();
    return bridge.getAdminDb();
};

export const getFieldValue = async () => {
    const bridge = await getBridge();
    return bridge.getFieldValue();
};
