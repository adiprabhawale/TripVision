import { getAi } from '../genkit';
import { z } from 'genkit';

const LocationSchema = z.object({
  latitude: z.number().describe('The latitude of the location.'),
  longitude: z.number().describe('The longitude of the location.'),
});

export const GeneratePersonalizedTripItineraryInputSchema = z.object({
  source: z.string().describe('The starting point for the trip.'),
  destination: z.string().describe('The destination for the trip.'),
  startDate: z.string().describe('The start date for the trip (YYYY-MM-DD).'),
  duration: z.number().describe('The duration of the trip in days.'),
  numberOfPeople: z.number().describe('The number of people traveling.'),
  budget: z.number().describe('The budget for the trip.'),
  budgetType: z.enum(['per-person', 'group']).describe('The type of budget (per person or total group).'),
  travelType: z.string().describe('The type of travel (e.g., Business, Friends, Family).'),
  stayType: z.string().describe('The preferred type of accommodation (e.g., Hotel, Hostel, Airbnb).'),
  interests: z.string().describe('The interests of the traveler.'),
});

export type GeneratePersonalizedTripItineraryInput =
  z.infer<typeof GeneratePersonalizedTripItineraryInputSchema>;

const GeneratePersonalizedTripItineraryOutputSchema = z.object({
  itinerary: z.array(
    z.object({
      day_number: z.number(),
      theme: z.string(),
      activities: z.array(
        z.object({
          id: z.string().describe('A unique identifier for the activity.'),
          time: z.string(),
          description: z.string(),
          estimated_cost: z.string(),
          location: LocationSchema.optional(),
        })
      ),
    })
  ),
  total_budget: z.string(),
  budget_notes: z.string().optional(),
  travel_options: z.array(z.object({
    type: z.enum(['Flight', 'Train', 'Bus', 'Connecting']),
    name: z.string(),
    fare: z.string(),
    bookingLink: z.string().url(),
    details: z.string(),
  })),
  stay_options: z.array(z.object({
    name: z.string(),
    type: z.string(),
    price_per_night: z.string(),
    bookingLink: z.string().url(),
    details: z.string(),
    location: LocationSchema.optional(),
  })),
});

export type GeneratePersonalizedTripItineraryOutput =
  z.infer<typeof GeneratePersonalizedTripItineraryOutputSchema>;

export async function generatePersonalizedTripItinerary(
  input: GeneratePersonalizedTripItineraryInput
): Promise<GeneratePersonalizedTripItineraryOutput> {
  const ai = getAi();
  
  const prompt = ai.definePrompt({
    name: 'generatePersonalizedTripItineraryPrompt',
    input: { schema: GeneratePersonalizedTripItineraryInputSchema },
    output: { schema: GeneratePersonalizedTripItineraryOutputSchema },
    prompt: `You are an expert travel planner AI assistant.
  
    Based on the user's preferences, generate a detailed trip itinerary.
  
    User Preferences:
    Source: {{{source}}}
    Destination: {{{destination}}}
    Start Date: {{{startDate}}}
    Duration: {{{duration}}} days
    Number of People: {{{numberOfPeople}}}
    Budget: {{{budget}}} (This is a {{budgetType}} budget)
    Travel Type: {{{travelType}}}
    Stay Type: {{{stayType}}}
    Interests: {{{interests}}}
  
    Please provide the following:
    1. A detailed day-by-day itinerary. The plan should be suitable for the specified travel type. For each activity, include its estimated latitude and longitude if applicable.
    2. The total estimated budget for the trip for all people. If the estimated total budget exceeds the user's specified budget, provide a brief explanation in the 'budget_notes' field.
    3. A summary of potential travel options (flights, trains, buses) between the source and destination for the given dates.
    4. A list of accommodation options that fit the user's budget and stay type preference. For each stay option, include its estimated latitude and longitude.

    For each travel option, provide the name of the carrier/service, an estimated fare, a short summary of the trip, and an example booking link (e.g., to Google Flights, Kayak, Amtrak, etc.). If a travel mode is not available, set the fare to "Unavailable" and provide a link to a general travel search engine. For trips with connections, describe the different legs in the details.
    
    For each stay option, provide the property name, type, price per night, a short summary, a direct booking link, and its location coordinates.
    - For Airbnb options, the booking link should be a search URL. Construct it like this: 'https://www.airbnb.com/s/URL_ENCODED_DESTINATION/homes?checkin=YYYY-MM-DD&checkout=YYYY-MM-DD&adults=NUMBER_OF_PEOPLE'.
    - For other stay types like hotels or hostels, the link can be to a booking site like Booking.com or the property's own website.

    Provide the response in JSON format matching the requested schema. Make sure the generated JSON is parsable.`,
    config: {
      safetySettings: [
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_ONLY_HIGH',
        },
      ],
    },
  });

  const { output } = await prompt(input);
  return output!;
}
