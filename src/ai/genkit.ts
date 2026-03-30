import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

export function getAi() {
    const plugins = [googleAI({apiKey: process.env.GEMINI_API_KEY})];
    return genkit({
        plugins,
        model: 'googleai/gemini-2.5-flash',
    });
}
