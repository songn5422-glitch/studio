'use server';
/**
 * @fileOverview An AI agent to categorize a purchase as Need or Want.
 *
 * - categorizePurchase - A function that categorizes a purchase.
 * - CategorizePurchaseInput - The input type for the categorizePurchase function.
 * - CategorizePurchaseOutput - The return type for the categorizePurchase function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const CategorizePurchaseInputSchema = z.object({
  productName: z.string().describe('The name of the product purchased.'),
  price: z.number().describe('The price of the product in USD.'),
});
export type CategorizePurchaseInput = z.infer<typeof CategorizePurchaseInputSchema>;

const CategorizePurchaseOutputSchema = z.object({
  category: z.enum(['Need', 'Want']).describe('The category of the purchase.'),
  reasoning: z.string().describe('The AI reasoning behind the categorization.'),
});
export type CategorizePurchaseOutput = z.infer<typeof CategorizePurchaseOutputSchema>;

export async function categorizePurchase(input: CategorizePurchaseInput): Promise<CategorizePurchaseOutput> {
  return categorizePurchaseFlow(input);
}

const prompt = ai.definePrompt({
  name: 'categorizePurchasePrompt',
  input: {schema: CategorizePurchaseInputSchema},
  output: {schema: CategorizePurchaseOutputSchema},
  prompt: `You are a personal finance advisor helping users categorize their purchases.

  Based on the product name and price, determine if the purchase is a "Need" or a "Want".

  Provide a brief reasoning for your categorization.

  Product Name: {{{productName}}}
  Price: {{{price}}} USD`,
});

const categorizePurchaseFlow = ai.defineFlow(
  {
    name: 'categorizePurchaseFlow',
    inputSchema: CategorizePurchaseInputSchema,
    outputSchema: CategorizePurchaseOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
