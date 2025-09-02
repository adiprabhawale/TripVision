'use server';
/**
 * @fileOverview Generates a personalized trip itinerary using AI based on user preferences.
 *
 * - generatePersonalizedTripItinerary - A function that generates a personalized trip itinerary.
 * - GeneratePersonalizedTripItineraryInput - The input type for the generatePersonalizedTripItinerary function.
 * - GeneratePersonalizedTripItineraryOutput - The return type for the generatePersonalizedTripItinerary function.
 */

import {getAi} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedTripItineraryInputSchema = z.object({
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
          time: z.string(),
          description: z.string(),
          estimated_cost: z.string(),
        })
      ),
    })
  ),
  total_budget: z.string().describe("The calculated total budget for the trip."),
  budget_notes: z.string().optional().describe("Notes about the budget. If the total calculated budget exceeds the user's requested budget, explain why (e.g., high travel costs, expensive accommodation choice)."),
  travel_options: z.array(z.object({
    type: z.enum(['Flight', 'Train', 'Bus', 'Connecting']),
    name: z.string().describe('The name of the travel provider and service (e.g., "United Airlines UA234", "Amtrak Northeast Regional"). For connecting travel, summarize the trip (e.g., "Flight to Layover + Train to Destination").'),
    fare: z.string().describe('The estimated fare for this option (e.g., "$250", "Unavailable").'),
    bookingLink: z.string().url().describe('An example booking link to a site like Google Flights, Kayak, or the provider\'s website. If unavailable, provide a link to a general search page.'),
    details: z.string().describe('A short summary of the travel option, including duration and any layovers. For connecting travel, describe the different legs of the journey.'),
  })).describe("A list of flight, train, and bus options for the travel dates. Provide direct booking links and fare estimates."),
  stay_options: z.array(z.object({
    name: z.string().describe("The name of the accommodation."),
    type: z.string().describe("The type of property (e.g., Hotel, Hostel, Airbnb)."),
    price_per_night: z.string().describe("The estimated price per night."),
    bookingLink: z.string().url().describe("An example booking link to a site like Booking.com, Airbnb, or the property's website."),
    details: z.string().describe("A short summary of the accommodation, including rating or key features."),
  })).describe("A list of accommodation options that fit the user's budget and stay preferences."),
});

export type GeneratePersonalizedTripItineraryOutput =
  z.infer<typeof GeneratePersonalizedTripItineraryOutputSchema>;

export async function generatePersonalizedTripItinerary(
  input: GeneratePersonalizedTripItineraryInput,
  apiKey: string
): Promise<GeneratePersonalizedTripItineraryOutput> {
  return generatePersonalizedTripItineraryFlow(input, apiKey);
}

function getPrompt(ai: any) {
  return ai.definePrompt({
    name: 'generatePersonalizedTripItineraryPrompt',
    input: {schema: GeneratePersonalizedTripItineraryInputSchema},
    output: {schema: GeneratePersonalizedTripItineraryOutputSchema},
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
    1. A detailed day-by-day itinerary. The plan should be suitable for the specified travel type.
    2. The total estimated budget for the trip for all people. If the estimated total budget exceeds the user's specified budget, provide a brief explanation in the 'budget_notes' field.
    3. A summary of potential travel options (flights, trains, buses) between the source and destination for the given dates.
    4. A list of accommodation options that fit the user's budget and stay type preference.

    For each travel option, provide the name of the carrier/service, an estimated fare, a short summary of the trip, and an example booking link (e.g., to Google Flights, Kayak, Amtrak, etc.). If a travel mode is not available, set the fare to "Unavailable" and provide a link to a general travel search engine. For trips with connections, describe the different legs in the details.
    
    For each stay option, provide the property name, type, price per night, a short summary, and a direct booking link (e.g., to Booking.com, Airbnb, etc.).

    Provide the response in JSON format.
    The JSON should conform to the following schema:
    {
      "type": "OBJECT",
      "properties": {
        "itinerary": {
          "type": "ARRAY",
          "items": {
            "type": "OBJECT",
            "properties": {
              "day_number": { "type": "NUMBER" },
              "theme": { "type": "STRING" },
              "activities": {
                "type": "ARRAY",
                "items": {
                  "type": "OBJECT",
                  "properties": {
                    "time": { "type": "STRING" },
                    "description": { "type": "STRING" },
                    "estimated_cost": { "type": "STRING" }
                  }
                }
              }
            }
          }
        },
        "total_budget": {
           "type": "STRING",
           "description": "The calculated total budget for the trip."
        },
        "budget_notes": {
          "type": "STRING",
          "description": "Notes about the budget. If the total calculated budget exceeds the user's requested budget, explain why (e.g., high travel costs, expensive accommodation choice)."
        },
        "travel_options": {
            "type": "ARRAY",
            "description": "A list of flight, train, and bus options for the travel dates.",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "type": { "type": "STRING", "enum": ["Flight", "Train", "Bus", "Connecting"] },
                    "name": { "type": "STRING", "description": "The name of the travel provider and service (e.g., \\"United Airlines UA234\\", \\"Amtrak Northeast Regional\\")." },
                    "fare": { "type": "STRING", "description": "The estimated fare for this option (e.g., \\"$250\\", \\"Unavailable\\")." },
                    "bookingLink": { "type": "STRING", "format": "uri", "description": "An example booking link." },
                    "details": { "type": "STRING", "description": "A short summary of the travel option, including duration and any layovers." }
                },
                "required": ["type", "name", "fare", "bookingLink", "details"]
            }
        },
        "stay_options": {
            "type": "ARRAY",
            "description": "A list of accommodation options.",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "name": { "type": "STRING", "description": "The name of the accommodation." },
                    "type": { "type": "STRING", "description": "The type of property (e.g., Hotel, Hostel, Airbnb)." },
                    "price_per_night": { "type": "STRING", "description": "The estimated price per night." },
                    "bookingLink": { "type": "STRING", "format": "uri", "description": "An example booking link." },
                    "details": { "type": "STRING", "description": "A short summary of the accommodation." }
                },
                "required": ["name", "type", "price_per_night", "bookingLink", "details"]
            }
        }
      },
      "required": ["itinerary", "total_budget", "travel_options", "stay_options"]
    }
    Make sure the generated JSON is parsable.
    `,
    config: {
      safetySettings: [
        {
          category: 'HARM_CATEGORY_DANGEROUS_CONTENT',
          threshold: 'BLOCK_ONLY_HIGH',
        },
      ],
    },
  });
}


async function generatePersonalizedTripItineraryFlow(
  input: GeneratePersonalizedTripItineraryInput,
  apiKey: string
): Promise<GeneratePersonalizedTripItineraryOutput> {
    const ai = getAi(apiKey);
    const prompt = getPrompt(ai);
    const {output} = await prompt(input);
    return output!;
}
