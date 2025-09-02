'use server';

import { generatePersonalizedTripItinerary } from '@/ai/flows/generate-personalized-trip-itinerary';
import type { TripPreferences } from '@/types/trip';
import { format } from 'date-fns';

export async function getItinerary(
  preferences: TripPreferences,
  apiKey: string
) {
  try {
    const validatedPreferences = {
        ...preferences,
        duration: parseInt(preferences.duration, 10),
        numberOfPeople: parseInt(preferences.numberOfPeople, 10),
        budget: preferences.budget,
        startDate: format(preferences.startDate, 'yyyy-MM-dd')
    }

    if (isNaN(validatedPreferences.duration) || validatedPreferences.duration <= 0) {
        return { error: 'Please enter a valid trip duration.' };
    }
    if (isNaN(validatedPreferences.numberOfPeople) || validatedPreferences.numberOfPeople <= 0) {
        return { error: 'Please enter a valid number of people.' };
    }

    const result = await generatePersonalizedTripItinerary(validatedPreferences, apiKey);
    return { data: result };
  } catch (e) {
    console.error(e);
    return { error: 'Failed to generate itinerary. Please try again.' };
  }
}
