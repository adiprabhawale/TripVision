'use server';

import { getAdminDb, getFieldValue } from '@/lib/firebase-admin';

export async function addPackingItem(tripId: string, userId: string, text: string) {
  try {
    const adminDb = await getAdminDb();
    const FieldValue = await getFieldValue();
    const tripRef = adminDb.collection('trips').doc(tripId);
    const itemRef = await tripRef.collection('packingList').add({
      text,
      completed: false,
      addedBy: userId,
      createdAt: FieldValue.serverTimestamp(),
    });
    
    return { success: true, itemId: itemRef.id };
  } catch (error: any) {
    console.error('Error adding packing item:', error);
    return { error: error.message || 'Failed to add item.' };
  }
}

export async function togglePackingItem(tripId: string, itemId: string, completed: boolean) {
  try {
    const adminDb = await getAdminDb();
    const tripRef = adminDb.collection('trips').doc(tripId);
    await tripRef.collection('packingList').doc(itemId).update({
      completed,
    });
    return { success: true };
  } catch (error: any) {
    console.error('Error toggling packing item:', error);
    return { error: error.message || 'Failed to toggle item.' };
  }
}

export async function deletePackingItem(tripId: string, itemId: string) {
  try {
    const adminDb = await getAdminDb();
    const tripRef = adminDb.collection('trips').doc(tripId);
    await tripRef.collection('packingList').doc(itemId).delete();
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting packing item:', error);
    return { error: error.message || 'Failed to delete item.' };
  }
}
