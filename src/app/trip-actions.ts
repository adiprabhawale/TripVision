'use server';

import { getAdminDb, getAdminAuth } from '@/lib/firebase-admin';

export async function getTripById(tripId: string) {
  try {
    const adminDb = await getAdminDb();
    const tripDoc = await adminDb.collection('trips').doc(tripId).get();
    
    if (!tripDoc.exists) {
      return { error: 'Trip not found.' };
    }

    const data = tripDoc.data();
    // Convert Timestamps to ISO strings for serialization
    if (data?.createdAt) {
      data.createdAt = data.createdAt.toDate().toISOString();
    }

    return { data };
  } catch (error: any) {
    console.error('Error fetching trip:', error);
    return { error: error.message || 'Failed to fetch trip.' };
  }
}

export async function getUserTrips(token: string) {
  try {
    const adminAuth = await getAdminAuth();
    const adminDb = await getAdminDb();
    const decodedToken = await adminAuth.verifyIdToken(token);
    const uid = decodedToken.uid;

    if (!uid) return { error: 'Unauthorized' };

    const tripsSnapshot = await adminDb.collection('trips')
      .where('collaborators', 'array-contains', uid)
      .orderBy('createdAt', 'desc')
      .get();

    const trips = tripsSnapshot.docs.map(doc => {
        const data = doc.data();
        return {
            id: doc.id,
            destination: data.preferences?.destination || 'Unknown Destination',
            startDate: data.preferences?.startDate || null,
            duration: data.preferences?.duration || 0,
            createdAt: data.createdAt?.toDate()?.toISOString() || null
        };
    });

    return { trips };
  } catch (error: any) {
    console.error('Error fetching user trips:', error);
    return { error: error.message || 'Failed to fetch trips.' };
  }
}
