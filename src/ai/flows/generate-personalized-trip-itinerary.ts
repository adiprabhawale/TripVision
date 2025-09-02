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
  travel_options: z.array(z.object({
    type: z.enum(['Flight', 'Train', 'Bus']),
    details: z.string(),
  })).describe("A list of flight, train, and bus options for the travel dates."),
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
    Also, provide insights on booking considerations like travel availability and pricing.
  
    User Preferences:
    Source: {{{source}}}
    Destination: {{{destination}}}
    Start Date: {{{startDate}}}
    Duration: {{{duration}}} days
    Number of People: {{{numberOfPeople}}}
    Budget: {{{budget}}} (This is a {{budgetType}} budget)
    Travel Type: {{{travelType}}}
    Interests: {{{interests}}}
  
    Please provide the following:
    1. A detailed day-by-day itinerary. The plan should be suitable for the specified travel type.
    2. The total estimated budget for the trip for all people.
    3. A summary of potential travel options (flights, trains, buses) between the source and destination for the given dates. For each travel option, provide a short summary of availability and price range.

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
        "travel_options": {
            "type": "ARRAY",
            "description": "A list of flight, train, and bus options for the travel dates.",
            "items": {
                "type": "OBJECT",
                "properties": {
                    "type": { "type": "STRING", "enum": ["Flight", "Train", "Bus"] },
                    "details": { "type": "STRING" }
                }
            }
        }
      },
      "required": ["itinerary", "total_budget", "travel_options"]
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
