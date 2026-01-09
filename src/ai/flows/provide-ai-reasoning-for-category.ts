'use server';

/**
 * @fileOverview An AI agent that provides reasoning for categorizing a purchase as Need or Want.
 *
 * - provideAIReasoningForCategory - A function that provides the AI's reasoning for the category.
 * - ProvideAIReasoningForCategoryInput - The input type for the provideAIReasoningForCategory function.
 * - ProvideAIReasoningForCategoryOutput - The return type for the provideAIReasoningForCategory function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ProvideAIReasoningForCategoryInputSchema = z.object({
  productName: z.string().describe('The name of the product purchased.'),
  productCategory: z.string().describe('The category the product was classified as (Need or Want).'),
  price: z.number().describe('The price of the product in USD.'),
  userSpendingHistory: z.string().optional().describe('A summary of the user\'s recent spending habits.'),
});
export type ProvideAIReasoningForCategoryInput = z.infer<typeof ProvideAIReasoningForCategoryInputSchema>;

const ProvideAIReasoningForCategoryOutputSchema = z.object({
  reasoning: z.string().describe('The AI\'s reasoning for categorizing the purchase as Need or Want.'),
});
export type ProvideAIReasoningForCategoryOutput = z.infer<typeof ProvideAIReasoningForCategoryOutputSchema>;

export async function provideAIReasoningForCategory(input: ProvideAIReasoningForCategoryInput): Promise<ProvideAIReasoningForCategoryOutput> {
  return provideAIReasoningForCategoryFlow(input);
}

const prompt = ai.definePrompt({
  name: 'provideAIReasoningForCategoryPrompt',
  input: {schema: ProvideAIReasoningForCategoryInputSchema},
  output: {schema: ProvideAIReasoningForCategoryOutputSchema},
  prompt: `You are an AI assistant that provides reasoning for why a purchase was categorized as either a "Need" or a "Want".

  Given the following information, explain your reasoning in a concise and easy-to-understand manner.

  Product Name: {{{productName}}}
  Category: {{{productCategory}}}
  Price: {{{price}}}
  User Spending History: {{{userSpendingHistory}}}

  Reasoning: `,
});

const provideAIReasoningForCategoryFlow = ai.defineFlow(
  {
    name: 'provideAIReasoningForCategoryFlow',
    inputSchema: ProvideAIReasoningForCategoryInputSchema,
    outputSchema: ProvideAIReasoningForCategoryOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
