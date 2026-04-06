"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GeneratePersonalizedTripItineraryInputSchema = void 0;
exports.generatePersonalizedTripItinerary = generatePersonalizedTripItinerary;
const genkit_1 = require("../genkit");
const genkit_2 = require("genkit");
const LocationSchema = genkit_2.z.object({
    latitude: genkit_2.z.number().describe('The latitude of the location.'),
    longitude: genkit_2.z.number().describe('The longitude of the location.'),
});
exports.GeneratePersonalizedTripItineraryInputSchema = genkit_2.z.object({
    source: genkit_2.z.string().describe('The starting point for the trip.'),
    destination: genkit_2.z.string().describe('The destination for the trip.'),
    startDate: genkit_2.z.string().describe('The start date for the trip (YYYY-MM-DD).'),
    duration: genkit_2.z.number().describe('The duration of the trip in days.'),
    numberOfPeople: genkit_2.z.number().describe('The number of people traveling.'),
    budget: genkit_2.z.number().describe('The budget for the trip.'),
    budgetType: genkit_2.z.enum(['per-person', 'group']).describe('The type of budget (per person or total group).'),
    travelType: genkit_2.z.string().describe('The type of travel (e.g., Business, Friends, Family).'),
    stayType: genkit_2.z.string().describe('The preferred type of accommodation (e.g., Hotel, Hostel, Airbnb).'),
    interests: genkit_2.z.string().describe('The interests of the traveler.'),
});
const GeneratePersonalizedTripItineraryOutputSchema = genkit_2.z.object({
    itinerary: genkit_2.z.array(genkit_2.z.object({
        day_number: genkit_2.z.number(),
        theme: genkit_2.z.string(),
        activities: genkit_2.z.array(genkit_2.z.object({
            id: genkit_2.z.string().describe('A unique identifier for the activity.'),
            time: genkit_2.z.string(),
            description: genkit_2.z.string(),
            estimated_cost: genkit_2.z.string(),
            location: LocationSchema.optional(),
        })),
    })),
    total_budget: genkit_2.z.string(),
    budget_notes: genkit_2.z.string().optional(),
    travel_options: genkit_2.z.array(genkit_2.z.object({
        type: genkit_2.z.enum(['Flight', 'Train', 'Bus', 'Connecting']),
        name: genkit_2.z.string(),
        fare: genkit_2.z.string(),
        bookingLink: genkit_2.z.string().url(),
        details: genkit_2.z.string(),
    })),
    stay_options: genkit_2.z.array(genkit_2.z.object({
        name: genkit_2.z.string(),
        type: genkit_2.z.string(),
        price_per_night: genkit_2.z.string(),
        bookingLink: genkit_2.z.string().url(),
        details: genkit_2.z.string(),
        location: LocationSchema.optional(),
    })),
});
async function generatePersonalizedTripItinerary(input) {
    const ai = (0, genkit_1.getAi)();
    const prompt = ai.definePrompt({
        name: 'generatePersonalizedTripItineraryPrompt',
        input: { schema: exports.GeneratePersonalizedTripItineraryInputSchema },
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
    return output;
}
//# sourceMappingURL=generate-personalized-trip-itinerary.js.map