import { onCall, HttpsError } from "firebase-functions/v2/https";
import { generatePersonalizedTripItinerary } from "./ai/flows/generate-personalized-trip-itinerary";
import { getAdminDb, getFieldValue } from "./lib/firebase-admin";

export const generateItinerary = onCall({ region: "us-central1", cors: true }, async (request) => {
  try {
    // 1. Verify User (automatically handled by onCall but we double-check)
    if (!request.auth) {
      throw new HttpsError('unauthenticated', 'User must be authenticated to generate an itinerary.');
    }
    
    const uid = request.auth.uid;
    const email = request.auth.token.email;
    const isAdmin = email === 'adiprabhawale@gmail.com';
    
    const adminDb = getAdminDb();
    const FieldValue = getFieldValue();

    // 2. Check Usage Limits
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();
    
    if (!userDoc.exists) {
      throw new HttpsError('not-found', 'User profile not found.');
    }
    
    const userData = userDoc.data();
    const isPremium = userData?.isPremium || false;
    const lastTripTimestamp = userData?.lastTripTimestamp?.toDate();
    const now = new Date();

    if (!isAdmin && !isPremium && lastTripTimestamp) {
      const hoursSinceLastTrip = (now.getTime() - lastTripTimestamp.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastTrip < 24) {
        const remainingHours = Math.ceil(24 - hoursSinceLastTrip);
        throw new HttpsError('resource-exhausted', `Free limit reached. Please wait ${remainingHours} hours or upgrade to Premium.`);
      }
    }

    // 3. Validate Preferences
    const rawPreferences = request.data.preferences;
    
    // We expect the client to send valid preferences aligning with the frontend format.
    // Ensure duration and numberOfPeople are valid numbers
    const duration = parseInt(rawPreferences.duration, 10);
    const numberOfPeople = parseInt(rawPreferences.numberOfPeople, 10);
    
    if (isNaN(duration) || duration <= 0) {
      throw new HttpsError('invalid-argument', 'Please enter a valid trip duration.');
    }
    if (isNaN(numberOfPeople) || numberOfPeople <= 0) {
      throw new HttpsError('invalid-argument', 'Please enter a valid number of people.');
    }

    // 4. Generate Itinerary Using Genkit
    // We pass the rawPreferences into the Genkit input schema.
    const result = await generatePersonalizedTripItinerary(rawPreferences as any);

    // 5. Save Trip to Firestore
    const tripRef = await adminDb.collection('trips').add({
      ...result,
      preferences: rawPreferences,
      userId: uid,
      createdAt: FieldValue.serverTimestamp(),
      collaborators: [uid],
    });

    // 6. Update User Usage
    await userRef.update({
      lastTripTimestamp: FieldValue.serverTimestamp(),
      tripCount: (userData?.tripCount || 0) + 1,
    });

    return { 
        success: true, 
        data: result, 
        tripId: tripRef.id 
    };
    
  } catch (error: any) {
    console.error("Error running generateItinerary:", error);
    if (error instanceof HttpsError) {
        throw error;
    }
    throw new HttpsError('internal', error.message || 'Failed to generate itinerary. Please try again.');
  }
});
