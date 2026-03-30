'use server';

import { getAdminDb } from '@/lib/firebase-admin';

export async function upgradeToPremium(userId: string) {
  try {
    const adminDb = await getAdminDb();
    await adminDb.collection('users').doc(userId).update({
      isPremium: true,
      upgradedAt: new Date().toISOString(),
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error upgrading user:', error);
    return { error: error.message || 'Failed to upgrade to premium.' };
  }
}
