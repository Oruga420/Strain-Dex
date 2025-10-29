import type { ExtractedProductInfo } from '../types';

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') || '';

interface AnalyzeResponse {
  error?: string;
}

export const analyzeProduct = async (
  base64Image: string,
  userReview: string
): Promise<ExtractedProductInfo> => {
  const response = await fetch(`${API_BASE_URL}/api/analyze`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      image: base64Image,
      review: userReview
    })
  });

  const payload: AnalyzeResponse | ExtractedProductInfo = await response.json();

  if (!response.ok || 'error' in payload) {
    const message =
      (payload as AnalyzeResponse)?.error ?? 'Failed to analyze product.';
    throw new Error(message);
  }

  return payload as ExtractedProductInfo;
};
