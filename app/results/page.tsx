'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ModelCard from '@/components/ModelCard'
import { AnalysisResults } from '@/types'

export default function ResultsPage() {
  const router = useRouter()
  const [results, setResults] = useState<AnalysisResults | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const storedResults = sessionStorage.getItem('analysisResults')
    if (storedResults) {
      try {
        setResults(JSON.parse(storedResults))
      } catch (err) {
        console.error('Failed to parse results:', err)
      }
    }
    setIsLoading(false)
  }, [])

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading results...</p>
        </div>
      </div>
    )
  }

  if (!results) {
    return (
      <div className="text-center py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">
          No Results Found
        </h2>
        <p className="text-gray-600 mb-6">
          Please analyze an image first to see results.
        </p>
        <button
          onClick={() => router.push('/')}
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          Go to Home
        </button>
      </div>
    )
  }

  const models = [
    {
      key: 'openai',
      name: 'OpenAI GPT-4o',
      result: results.openai,
      runtime: results.runtime?.openai,
      color: 'bg-green-50 border-green-200',
      headerColor: 'bg-green-600',
    },
    {
      key: 'gpt4_1',
      name: 'OpenAI GPT-4.1',
      result: results.gpt4_1,
      runtime: results.runtime?.gpt4_1,
      color: 'bg-teal-50 border-teal-200',
      headerColor: 'bg-teal-600',
    },
    {
      key: 'gemini',
      name: 'Google Gemini 1.5 Pro',
      result: results.gemini,
      runtime: results.runtime?.gemini,
      color: 'bg-blue-50 border-blue-200',
      headerColor: 'bg-blue-600',
    },
    {
      key: 'qwen',
      name: 'Qwen-VL',
      result: results.qwen,
      runtime: results.runtime?.qwen,
      color: 'bg-purple-50 border-purple-200',
      headerColor: 'bg-purple-600',
    },
    {
      key: 'llama',
      name: 'Llama Vision',
      result: results.llama,
      runtime: results.runtime?.llama,
      color: 'bg-orange-50 border-orange-200',
      headerColor: 'bg-orange-600',
    },
  ]

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">
          Analysis Results
        </h1>
        <button
          onClick={() => router.push('/')}
          className="text-primary-600 hover:text-primary-700 font-medium"
        >
          ← New Analysis
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {models.map((model) => (
          <ModelCard
            key={model.key}
            modelName={model.name}
            result={model.result}
            runtime={model.runtime}
            color={model.color}
            headerColor={model.headerColor}
          />
        ))}
      </div>

      {models.every((m) => !m.result || m.result.error) && (
        <div className="mt-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
          <p className="text-yellow-800 text-sm">
            All models failed to process the image. Please try again with a
            different image.
          </p>
        </div>
      )}
    </div>
  )
}

