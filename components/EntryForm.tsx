
import React, { useState } from 'react';
import { fileToBase64 } from '../utils/fileUtils';
import { analyzeProduct } from '../services/geminiService';
import Spinner from './Spinner';
import { ExtractedProductInfo } from '../types';

interface EntryFormProps {
  onAnalysisComplete: (data: ExtractedProductInfo, image: string, originalReview: string) => void;
  onCancel: () => void;
}

const EntryForm: React.FC<EntryFormProps> = ({ onAnalysisComplete, onCancel }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [review, setReview] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageFile || !review) {
      setError('Please provide both an image and a review.');
      return;
    }
    setError(null);
    setIsLoading(true);
    try {
      const base64Image = await fileToBase64(imageFile);
      const analysisResult = await analyzeProduct(base64Image, review);
      onAnalysisComplete(analysisResult, base64Image, review);
    } catch (err: any) {
      setError(err.message || 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="w-full h-full flex items-center justify-center p-8">
        <Spinner />
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-emerald-400">Log a New Entry</h2>
        <p className="text-gray-400">Upload an image and describe your experience.</p>
      </div>

      <div>
        <label htmlFor="file-upload" className="block text-sm font-medium text-gray-300 mb-2">
          Product Image
        </label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-600 border-dashed rounded-md">
          <div className="space-y-1 text-center">
            {imagePreview ? (
              <img src={imagePreview} alt="Preview" className="mx-auto h-40 w-auto rounded-md" />
            ) : (
               <svg
                className="mx-auto h-12 w-12 text-gray-500"
                stroke="currentColor"
                fill="none"
                viewBox="0 0 48 48"
                aria-hidden="true"
              >
                <path
                  d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            )}
            <div className="flex text-sm text-gray-500">
              <label
                htmlFor="file-upload"
                className="relative cursor-pointer bg-gray-800 rounded-md font-medium text-emerald-400 hover:text-emerald-300 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-900 focus-within:ring-emerald-500 px-2"
              >
                <span>Upload a file</span>
                <input id="file-upload" name="file-upload" type="file" accept="image/*" className="sr-only" onChange={handleFileChange} />
              </label>
              <p className="pl-1">or drag and drop</p>
            </div>
            <p className="text-xs text-gray-600">PNG, JPG, GIF up to 10MB</p>
          </div>
        </div>
      </div>

      <div>
        <label htmlFor="review" className="block text-sm font-medium text-gray-300">
          Your Experience
        </label>
        <textarea
          id="review"
          rows={5}
          className="mt-1 block w-full bg-gray-800 border-gray-600 rounded-md shadow-sm focus:ring-emerald-500 focus:border-emerald-500 sm:text-sm text-white p-2"
          placeholder="How did it smoke? What were the effects? Describe the flavor and aroma..."
          value={review}
          onChange={(e) => setReview(e.target.value)}
        />
      </div>

      {error && <p className="text-red-500 text-sm text-center">{error}</p>}

      <div className="flex items-center justify-between gap-4 pt-4">
        <button
          type="button"
          onClick={onCancel}
          className="inline-flex items-center justify-center w-full px-4 py-2 border border-gray-600 shadow-sm text-sm font-medium rounded-md text-gray-300 bg-gray-700 hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-gray-500 transition-colors"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!imageFile || !review}
          className="inline-flex items-center justify-center w-full px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-emerald-600 hover:bg-emerald-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-emerald-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          Analyze
        </button>
      </div>
    </form>
  );
};

export default EntryForm;
