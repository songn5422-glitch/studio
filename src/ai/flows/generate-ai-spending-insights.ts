'use server';

/**
 * @fileOverview Generates AI-driven insights on user spending habits.
 *
 * - generateAISpendingInsights - A function that generates spending insights.
 * - GenerateAISpendingInsightsInput - The input type for the generateAISpendingInsights function.
 * - GenerateAISpendingInsightsOutput - The return type for the generateAISpendingInsights function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateAISpendingInsightsInputSchema = z.object({
  transactionHistory: z.string().describe('The user\'s transaction history in JSON format.'),
});
export type GenerateAISpendingInsightsInput = z.infer<typeof GenerateAISpendingInsightsInputSchema>;

const GenerateAISpendingInsightsOutputSchema = z.object({
  insights: z.string().describe('AI-generated insights on spending habits.'),
});
export type GenerateAISpendingInsightsOutput = z.infer<typeof GenerateAISpendingInsightsOutputSchema>;

export async function generateAISpendingInsights(input: GenerateAISpendingInsightsInput): Promise<GenerateAISpendingInsightsOutput> {
  return generateAISpendingInsightsFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateAISpendingInsightsPrompt',
  input: {schema: GenerateAISpendingInsightsInputSchema},
  output: {schema: GenerateAISpendingInsightsOutputSchema},
  prompt: `You are a personal finance advisor. Analyze the user\'s transaction history and provide insights on their spending habits.

Transaction History:
{{{transactionHistory}}}

Provide actionable advice on how the user can save money and improve their financial health. Focus on trends and patterns.

Format the insights in a clear and concise manner.`,
});

const generateAISpendingInsightsFlow = ai.defineFlow(
  {
    name: 'generateAISpendingInsightsFlow',
    inputSchema: GenerateAISpendingInsightsInputSchema,
    outputSchema: GenerateAISpendingInsightsOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
