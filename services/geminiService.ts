
import { GoogleGenAI, Type } from "@google/genai";
import { ExtractedProductInfo } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable is not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const responseSchema = {
    type: Type.OBJECT,
    properties: {
        manufacturer: {
            type: Type.STRING,
            description: "The company or brand that produced the product."
        },
        productName: {
            type: Type.STRING,
            description: "The specific name of the product."
        },
        strain: {
            type: Type.STRING,
            description: "The strain of the cannabis (e.g., Blue Dream, OG Kush)."
        },
        potency: {
            type: Type.STRING,
            description: "The THC/CBD content, usually as a percentage or mg/g."
        },
        otherDetails: {
            type: Type.ARRAY,
            items: { type: Type.STRING },
            description: "An array of other relevant info (e.g., weight, lot number, product type)."
        },
        enhancedReview: {
            type: Type.STRING,
            description: "The user's review, rewritten to be more eloquent and descriptive."
        }
    },
    required: ["manufacturer", "productName", "strain", "potency", "otherDetails", "enhancedReview"]
};

export const analyzeProduct = async (
  base64Image: string,
  userReview: string
): Promise<ExtractedProductInfo> => {
  const imagePart = {
    inlineData: {
      data: base64Image.split(',')[1],
      mimeType: base64Image.match(/data:(.*);base64/)?.[1] || 'image/jpeg',
    },
  };

  const prompt = `
    You are a sophisticated cannabis product analysis tool for a 'Pokédex for Weed' app. Your task is to analyze an image of a cannabis product package and a user's review, then return a structured JSON object.

    From the IMAGE, extract:
    - manufacturer: The brand that produced the product.
    - productName: The product's name.
    - strain: The cannabis strain.
    - potency: The THC/CBD content.
    - otherDetails: An array of any other relevant text on the packaging.

    From the USER'S REVIEW, rewrite it to be more eloquent and descriptive, like a connoisseur would.
    
    User's Review: "${userReview}"

    Return ONLY a single, valid JSON object matching the defined schema. Do not add any other text or markdown.
    `;
  
  const textPart = { text: prompt };

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
      },
    });

    const jsonString = response.text;
    const parsedJson = JSON.parse(jsonString);
    
    // Ensure the response matches the expected structure
    const validatedData: ExtractedProductInfo = {
      manufacturer: parsedJson.manufacturer || "N/A",
      productName: parsedJson.productName || "N/A",
      strain: parsedJson.strain || "N/A",
      potency: parsedJson.potency || "N/A",
      otherDetails: Array.isArray(parsedJson.otherDetails) ? parsedJson.otherDetails : [],
      enhancedReview: parsedJson.enhancedReview || "Could not generate review.",
    };

    return validatedData;

  } catch (error) {
    console.error("Error analyzing product with Gemini:", error);
    throw new Error("Failed to analyze product. Please check the console for details.");
  }
};
