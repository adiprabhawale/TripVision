'use server';

import { getAdminDb, getFieldValue } from '@/lib/firebase-admin';

export async function voteOnActivity(tripId: string, activityId: string, userId: string, voteType: 'up' | 'down') {
  try {
    const adminDb = await getAdminDb();
    const FieldValue = await getFieldValue();
    const tripRef = adminDb.collection('trips').doc(tripId);
    const voteRef = tripRef.collection('votes').doc(`${activityId}_${userId}`);

    if (voteType === 'up') {
      await voteRef.set({
        activityId,
        userId,
        vote: 1,
        timestamp: FieldValue.serverTimestamp(),
      });
    } else {
      // Logic for downvote or removing vote
      await voteRef.delete();
    }

    // Recalculate total votes for the activity if needed, 
    // but better to use onSnapshot on the client to sum them up.
    
    return { success: true };
  } catch (error: any) {
    console.error('Error voting:', error);
    return { error: error.message || 'Failed to vote.' };
  }
}
