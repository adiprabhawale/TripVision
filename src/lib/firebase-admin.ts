// src/lib/firebase-admin.ts
import type { Auth } from 'firebase-admin/auth';
import type { Firestore } from 'firebase-admin/firestore';

// We use a CommonJS bridge to bypass Turbopack/Next.js 15 prototype errors
// with firebase-admin. This is the most stable way to load it in SSR.
// v4: Lazy-load INSIDE getters to prevent evaluation during SSR setup.
const getBridge = () => {
    const path = eval('require')('path');
    const bridgePath = path.join(process.cwd(), 'src/lib/firebase-admin-bridge-v3.js');
    return eval('require')(bridgePath);
};

export const getAdminAuth = async (): Promise<Auth> => {
    return getBridge().getAdminAuth();
};

export const getAdminDb = async (): Promise<Firestore> => {
    return getBridge().getAdminDb();
};

export const getFieldValue = async () => {
    return getBridge().getFieldValue();
};
