"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAi = getAi;
const genkit_1 = require("genkit");
const googleai_1 = require("@genkit-ai/googleai");
function getAi() {
    const plugins = [(0, googleai_1.googleAI)({ apiKey: process.env.GEMINI_API_KEY })];
    return (0, genkit_1.genkit)({
        plugins,
        model: 'googleai/gemini-2.5-flash',
    });
}
//# sourceMappingURL=genkit.js.map