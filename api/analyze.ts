import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Type } from '@google/genai';
import type { ExtractedProductInfo } from '../types';

const API_KEY = process.env.GEMINI_API_KEY ?? process.env.API_KEY;

if (!API_KEY) {
  throw new Error('Missing GEMINI_API_KEY environment variable');
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export const config = {
  runtime: 'nodejs20.x'
};

const responseSchema = {
  type: Type.OBJECT,
  properties: {
    manufacturer: { type: Type.STRING },
    productName: { type: Type.STRING },
    strain: { type: Type.STRING },
    potency: { type: Type.STRING },
    otherDetails: { type: Type.ARRAY, items: { type: Type.STRING } },
    enhancedReview: { type: Type.STRING }
  },
  required: ['manufacturer', 'productName', 'strain', 'potency', 'otherDetails', 'enhancedReview']
} as const;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method Not Allowed' });
  }

  const { image, review } = req.body ?? {};

  if (!image || typeof image !== 'string' || !review || typeof review !== 'string') {
    return res.status(400).json({ error: 'Both image and review fields are required.' });
  }

  try {
    const imagePart = {
      inlineData: {
        data: image.split(',')[1],
        mimeType: image.match(/data:(.*);base64/)?.[1] ?? 'image/jpeg'
      }
    };

    const prompt = `
      You are a sophisticated cannabis product analysis tool for a 'PokAdex for Weed' app. Your task is to analyze an image of a cannabis product package and a user's review, then return a structured JSON object.

      From the IMAGE, extract:
      - manufacturer: The brand that produced the product.
      - productName: The product's name.
      - strain: The cannabis strain.
      - potency: The THC/CBD content.
      - otherDetails: An array of any other relevant text on the packaging.

      From the USER'S REVIEW, rewrite it to be more eloquent and descriptive, like a connoisseur would.

      User's Review: "${review}"

      Return ONLY a single, valid JSON object matching the defined schema. Do not add any other text or markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, { text: prompt }] },
      config: {
        responseMimeType: 'application/json',
        responseSchema
      }
    });

    const parsed: ExtractedProductInfo = JSON.parse(response.text);

    return res.status(200).json(parsed);
  } catch (error) {
    console.error('Error analyzing product with Gemini:', error);
    return res.status(500).json({ error: 'Failed to analyze product.' });
  }
}
