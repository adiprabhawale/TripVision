// use server'
'use server';
/**
 * @fileOverview Generates a personalized trip itinerary using AI based on user preferences.
 *
 * - generatePersonalizedTripItinerary - A function that generates a personalized trip itinerary.
 * - GeneratePersonalizedTripItineraryInput - The input type for the generatePersonalizedTripItinerary function.
 * - GeneratePersonalizedTripItineraryOutput - The return type for the generatePersonalizedTripItinerary function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GeneratePersonalizedTripItineraryInputSchema = z.object({
  destination: z.string().describe('The destination for the trip.'),
  startDate: z.string().describe('The start date for the trip (YYYY-MM-DD).'),
  duration: z.number().describe('The duration of the trip in days.'),
  budget: z.string().describe('The budget for the trip.'),
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
  budget_forecast: z
    .string()
    .describe(
      'A brief analysis of how shifting the dates might affect the trip\'s cost.'
    ),
  travel_availability: z
    .string()
    .describe('A summary of flight and hotel availability for the chosen dates.'),
});

export type GeneratePersonalizedTripItineraryOutput =
  z.infer<typeof GeneratePersonalizedTripItineraryOutputSchema>;

export async function generatePersonalizedTripItinerary(
  input: GeneratePersonalizedTripItineraryInput
): Promise<GeneratePersonalizedTripItineraryOutput> {
  return generatePersonalizedTripItineraryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generatePersonalizedTripItineraryPrompt',
  input: {schema: GeneratePersonalizedTripItineraryInputSchema},
  output: {schema: GeneratePersonalizedTripItineraryOutputSchema},
  prompt: `You are an expert travel planner AI assistant.

  Based on the user's preferences, generate a detailed trip itinerary.
  Also, provide insights on booking considerations like travel availability and pricing.

  User Preferences:
  Destination: {{{destination}}}
  Start Date: {{{startDate}}}
  Duration: {{{duration}}} days
  Budget: {{{budget}}}
  Interests: {{{interests}}}

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
      "budget_forecast": {
         "type": "STRING",
         "description": "A brief analysis of how shifting the dates might affect the trip's cost."
      },
      "travel_availability": {
         "type": "STRING",
         "description": "A summary of flight and hotel availability for the chosen dates."
      }
    },
    "required": ["itinerary", "budget_forecast", "travel_availability"]
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

const generatePersonalizedTripItineraryFlow = ai.defineFlow(
  {
    name: 'generatePersonalizedTripItineraryFlow',
    inputSchema: GeneratePersonalizedTripItineraryInputSchema,
    outputSchema: GeneratePersonalizedTripItineraryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
