'use server';

import { getAdminDb, getFieldValue } from '@/lib/firebase-admin';

export async function addComment(tripId: string, activityId: string, userId: string, userName: string, userPhoto: string, text: string) {
  try {
    const adminDb = await getAdminDb();
    const FieldValue = await getFieldValue();
    const tripRef = adminDb.collection('trips').doc(tripId);
    const commentRef = await tripRef.collection('comments').add({
      activityId,
      userId,
      userName,
      userPhoto,
      text,
      createdAt: FieldValue.serverTimestamp(),
    });
    
    return { success: true, commentId: commentRef.id };
  } catch (error: any) {
    console.error('Error adding comment:', error);
    return { error: error.message || 'Failed to add comment.' };
  }
}

export async function deleteComment(tripId: string, commentId: string) {
  try {
    const adminDb = await getAdminDb();
    const tripRef = adminDb.collection('trips').doc(tripId);
    await tripRef.collection('comments').doc(commentId).delete();
    return { success: true };
  } catch (error: any) {
    console.error('Error deleting comment:', error);
    return { error: error.message || 'Failed to delete comment.' };
  }
}
