import { NextRequest, NextResponse } from 'next/server';
import { getAdminAuth, getAdminDb, getFieldValue } from '@/lib/firebase-admin';
import { generatePersonalizedTripItinerary } from '@/ai/flows/generate-personalized-trip-itinerary';

export async function OPTIONS() {
  return NextResponse.json({}, {
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
    },
  });
}

export async function POST(req: NextRequest) {
  // 1. Handle CORS Pre-flight & Headers
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    // 2. Verify Authorization Header
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401, headers: corsHeaders });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const adminAuth = await getAdminAuth();
    const decodedToken = await adminAuth.verifyIdToken(idToken);
    const uid = decodedToken.uid;
    const email = decodedToken.email;
    const isAdmin = email === 'adiprabhawale@gmail.com';

    if (!uid) {
      return NextResponse.json({ error: 'Unauthorized: Invalid token payload' }, { status: 401, headers: corsHeaders });
    }

    // 3. Initialize DB and Check Usage
    const adminDb = await getAdminDb();
    const FieldValue = await getFieldValue();
    const userRef = adminDb.collection('users').doc(uid);
    const userDoc = await userRef.get();

    if (!userDoc.exists) {
      return NextResponse.json({ error: 'User profile not found.' }, { status: 404, headers: corsHeaders });
    }

    const userData = userDoc.data();
    const isPremium = userData?.isPremium || false;
    const lastTripTimestamp = userData?.lastTripTimestamp?.toDate();
    const now = new Date();

    if (!isAdmin && !isPremium && lastTripTimestamp) {
      const hoursSinceLastTrip = (now.getTime() - lastTripTimestamp.getTime()) / (1000 * 60 * 60);
      if (hoursSinceLastTrip < 24) {
        const remainingHours = Math.ceil(24 - hoursSinceLastTrip);
        return NextResponse.json({ 
          error: `Free limit reached. Please wait ${remainingHours} hours or upgrade to Premium.` 
        }, { status: 429, headers: corsHeaders });
      }
    }

    // 4. Parse Preferences from Body
    const body = await req.json();
    const preferences = body.preferences;

    if (!preferences) {
      return NextResponse.json({ error: 'Missing preferences in request body' }, { status: 400, headers: corsHeaders });
    }

    // 5. Generate Itinerary Using Genkit Flow
    // We use the same flow shared by the web app
    const result = await generatePersonalizedTripItinerary(preferences);

    // 6. Save Trip to Firestore
    const tripRef = await adminDb.collection('trips').add({
      ...result,
      preferences,
      userId: uid,
      createdAt: FieldValue.serverTimestamp(),
      collaborators: [uid],
    });

    // 7. Update User Usage
    await userRef.update({
      lastTripTimestamp: FieldValue.serverTimestamp(),
      tripCount: (userData?.tripCount || 0) + 1,
    });

    return NextResponse.json({ 
      success: true, 
      data: result, 
      tripId: tripRef.id 
    }, { status: 200, headers: corsHeaders });

  } catch (error: any) {
    console.error('[API] Generation Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate itinerary. Please try again.' 
    }, { status: 500, headers: corsHeaders });
  }
}
