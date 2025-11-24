'use client'

import { ModelResult } from '@/types'

interface ModelCardProps {
  modelName: string
  result?: ModelResult
  runtime?: number
  color: string
  headerColor: string
}

export default function ModelCard({
  modelName,
  result,
  runtime,
  color,
  headerColor,
}: ModelCardProps) {
  const getSeverityColor = (severity?: string) => {
    if (!severity) return 'bg-gray-100 text-gray-700'
    const s = severity.toLowerCase()
    if (s === 'high') return 'bg-red-100 text-red-700'
    if (s === 'medium') return 'bg-amber-100 text-amber-700'
    if (s === 'low') return 'bg-emerald-100 text-emerald-700'
    return 'bg-gray-100 text-gray-700'
  }

  const getConfidenceColor = (confidence?: string) => {
    if (!confidence) return 'text-gray-600'
    const conf = parseFloat(confidence)
    if (conf >= 0.8) return 'text-emerald-600'
    if (conf >= 0.5) return 'text-amber-600'
    return 'text-red-500'
  }

  if (!result || result.error) {
    return (
      <div className={`${color} border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white`}>
        <div className={`${headerColor} text-gray-800 px-4 py-3 flex items-center justify-between`}>
          <h3 className="font-semibold">{modelName}</h3>
          {runtime && (
            <span className="text-xs bg-white/60 px-2 py-1 rounded text-gray-700">
              {runtime.toFixed(2)}s
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="text-red-500 text-sm">
            {result?.error || 'Failed to process'}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`${color} border border-gray-200 rounded-lg shadow-sm overflow-hidden bg-white`}>
      <div className={`${headerColor} text-gray-800 px-4 py-3 flex items-center justify-between`}>
        <h3 className="font-semibold">{modelName}</h3>
        <div className="flex items-center space-x-2">
          {runtime && (
            <span className="text-xs bg-white/60 px-2 py-1 rounded text-gray-700">
              {runtime.toFixed(2)}s
            </span>
          )}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {result.image_understanding && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Image Understanding
            </h4>
            <p className="text-sm text-gray-600">{result.image_understanding}</p>
          </div>
        )}

        {result.detected_defects && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Detected Defects
            </h4>
            <p className="text-sm text-gray-600">{result.detected_defects}</p>
          </div>
        )}

        {result.root_cause && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Root Cause
            </h4>
            <p className="text-sm text-gray-600">{result.root_cause}</p>
          </div>
        )}

        <div className="flex items-center space-x-4">
          {result.severity && (
            <div>
              <span className="text-xs font-semibold text-gray-700 mr-2">
                Severity:
              </span>
              <span
                className={`px-2 py-1 rounded text-xs font-medium ${getSeverityColor(
                  result.severity
                )}`}
              >
                {result.severity.toUpperCase()}
              </span>
            </div>
          )}

          {result.confidence && (
            <div>
              <span className="text-xs font-semibold text-gray-700 mr-2">
                Confidence:
              </span>
              <span
                className={`text-sm font-semibold ${getConfidenceColor(
                  result.confidence
                )}`}
              >
                {(parseFloat(result.confidence) * 100).toFixed(1)}%
              </span>
            </div>
          )}
        </div>

        {result.recommendations && (
          <div>
            <h4 className="text-sm font-semibold text-gray-700 mb-1">
              Recommendations
            </h4>
            <p className="text-sm text-gray-600">{result.recommendations}</p>
          </div>
        )}
      </div>
    </div>
  )
}

