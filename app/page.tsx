'use client'

import { useState } from 'react'
import ImageUpload from '@/components/ImageUpload'
import ModelCard from '@/components/ModelCard'
import { analyzeImage } from '@/services/api'
import { AnalysisResults } from '@/types'

export default function Home() {
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [description, setDescription] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [results, setResults] = useState<AnalysisResults | null>(null)

  const handleImageSelect = (file: File) => {
    setImageFile(file)
    setError(null)
    // Create preview
    const reader = new FileReader()
    reader.onloadend = () => {
      setImagePreview(reader.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleAnalyze = async () => {
    if (!imageFile) {
      setError('Please upload an image first')
      return
    }

    setIsLoading(true)
    setError(null)
    setResults(null)

    try {
      // Convert image to base64 or upload to storage first
      // For now, we'll convert to base64 data URL
      const imageUrl = imagePreview || ''
      
      const response = await analyzeImage(imageUrl, description)
      setResults(response)
    } catch (err: any) {
      setError(err.message || 'Failed to analyze image. Please try again.')
      console.error('Analysis error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewAnalysis = () => {
    setImageFile(null)
    setImagePreview(null)
    setDescription('')
    setResults(null)
    setError(null)
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Multi-Model Defect Detection
        </h1>
        <p className="text-lg text-gray-600">
          Upload an image and compare results from multiple AI models
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
        <ImageUpload
          onImageSelect={handleImageSelect}
          preview={imagePreview}
        />

        {error && (
          <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-md">
            <p className="text-sm text-red-800">{error}</p>
          </div>
        )}

        <div className="mt-6">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Description (Optional)
          </label>
          <textarea
            id="description"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Add any additional context about the defect or image..."
            className="w-full px-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-primary-500 focus:border-primary-500"
          />
        </div>

        <button
          onClick={handleAnalyze}
          disabled={!imageFile || isLoading}
          className="mt-6 w-full bg-primary-600 text-white py-3 px-6 rounded-md font-medium hover:bg-primary-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center"
        >
          {isLoading ? (
            <>
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Analyzing...
            </>
          ) : (
            'Analyze Image'
          )}
        </button>
      </div>

      {/* Results Section */}
      {results && (
        <div className="mt-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900">Analysis Results</h2>
            <button
              onClick={handleNewAnalysis}
              className="text-primary-600 hover:text-primary-700 font-medium text-sm"
            >
              New Analysis
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {results.openai && (
              <ModelCard
                modelName="OpenAI GPT-4o"
                result={results.openai}
                runtime={results.runtime?.openai}
                color="bg-emerald-50/50 border-emerald-100"
                headerColor="bg-emerald-100"
              />
            )}
            {results.gpt4_1 && (
              <ModelCard
                modelName="OpenAI GPT-4.1"
                result={results.gpt4_1}
                runtime={results.runtime?.gpt4_1}
                color="bg-teal-50/50 border-teal-100"
                headerColor="bg-teal-100"
              />
            )}
            {results.gemini && (
              <ModelCard
                modelName="Google Gemini 1.5 Pro"
                result={results.gemini}
                runtime={results.runtime?.gemini}
                color="bg-blue-50/50 border-blue-100"
                headerColor="bg-blue-100"
              />
            )}
            {results.qwen && (
              <ModelCard
                modelName="Qwen-VL"
                result={results.qwen}
                runtime={results.runtime?.qwen}
                color="bg-violet-50/50 border-violet-100"
                headerColor="bg-violet-100"
              />
            )}
            {results.llama && (
              <ModelCard
                modelName="Llama Vision"
                result={results.llama}
                runtime={results.runtime?.llama}
                color="bg-amber-50/50 border-amber-100"
                headerColor="bg-amber-100"
              />
            )}
          </div>

          {results.openai?.error && 
           (!results.gpt4_1 || results.gpt4_1?.error) &&
           (!results.gemini || results.gemini?.error) && 
           (!results.qwen || results.qwen?.error) && 
           (!results.llama || results.llama?.error) && (
            <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-800 text-sm">
                All models failed to process the image. Please try again with a different image.
              </p>
            </div>
          )}
        </div>
      )}

      {!results && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mt-6">
          <h3 className="text-sm font-semibold text-blue-900 mb-2">
            Supported Models
          </h3>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm text-blue-800">
            <div>OpenAI GPT-4o</div>
            <div>OpenAI GPT-4.1</div>
            <div>Google Gemini 1.5 Pro</div>
            <div>Qwen-VL</div>
            <div>Llama Vision</div>
          </div>
        </div>
      )}
    </div>
  )
}

