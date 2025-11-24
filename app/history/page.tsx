'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { getHistory } from '@/services/api'
import { HistoryItem } from '@/types'

export default function HistoryPage() {
  const router = useRouter()
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadHistory()
  }, [])

  const loadHistory = async () => {
    try {
      setIsLoading(true)
      const data = await getHistory()
      setHistory(data)
    } catch (err: any) {
      setError(err.message || 'Failed to load history')
      console.error('History error:', err)
    } finally {
      setIsLoading(false)
    }
  }

  const viewResults = (item: HistoryItem) => {
    sessionStorage.setItem('analysisResults', JSON.stringify(item.results))
    router.push('/results')
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading history...</p>
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Analysis History</h1>
        <button
          onClick={() => router.push('/')}
          className="bg-primary-600 text-white px-6 py-2 rounded-md hover:bg-primary-700 transition-colors"
        >
          New Analysis
        </button>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800">{error}</p>
        </div>
      )}

      {history.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow">
          <p className="text-gray-600 mb-4">No analysis history found.</p>
          <button
            onClick={() => router.push('/')}
            className="text-primary-600 hover:text-primary-700 font-medium"
          >
            Start your first analysis →
          </button>
        </div>
      ) : (
        <div className="space-y-4">
          {history.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow p-6 hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => viewResults(item)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <span className="text-sm font-medium text-gray-500">
                      {new Date(item.timestamp).toLocaleString()}
                    </span>
                  </div>
                  {item.description && (
                    <p className="text-gray-700 mb-3">{item.description}</p>
                  )}
                  <div className="flex flex-wrap gap-2">
                    {item.results.openai && (
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded">
                        OpenAI
                      </span>
                    )}
                    {item.results.gemini && (
                      <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded">
                        Gemini
                      </span>
                    )}
                    {item.results.qwen && (
                      <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded">
                        Qwen
                      </span>
                    )}
                    {item.results.llama && (
                      <span className="px-2 py-1 bg-orange-100 text-orange-800 text-xs rounded">
                        Llama
                      </span>
                    )}
                  </div>
                </div>
                <button className="text-primary-600 hover:text-primary-700 font-medium ml-4">
                  View →
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

