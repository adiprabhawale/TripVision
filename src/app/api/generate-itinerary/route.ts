import { NextRequest, NextResponse } from 'next/server';
import { handleGenerateItinerary } from '@/lib/services/itinerary';

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
  const corsHeaders = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization',
  };

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json({ error: 'Unauthorized: Missing or invalid token' }, { status: 401, headers: corsHeaders });
    }

    const idToken = authHeader.split('Bearer ')[1];
    const body = await req.json();
    const preferences = body.preferences;

    if (!preferences) {
      return NextResponse.json({ error: 'Missing preferences in request body' }, { status: 400, headers: corsHeaders });
    }

    // Call the Shared Service
    const result = await handleGenerateItinerary(idToken, preferences);

    if (result.success) {
        return NextResponse.json({ 
          success: true, 
          data: result.data, 
          tripId: result.tripId 
        }, { status: 200, headers: corsHeaders });
    } else {
        return NextResponse.json({ 
          error: result.error 
        }, { status: result.status, headers: corsHeaders });
    }

  } catch (error: any) {
    console.error('[API] Error:', error);
    return NextResponse.json({ 
      error: error.message || 'Failed to generate itinerary.' 
    }, { status: 500, headers: corsHeaders });
  }
}
