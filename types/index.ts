export interface ModelResult {
  image_understanding?: string
  detected_defects?: string
  root_cause?: string
  severity?: 'low' | 'medium' | 'high' | string
  recommendations?: string
  confidence?: string
  error?: string
}

export interface AnalysisResults {
  openai?: ModelResult
  gpt4_1?: ModelResult
  gemini?: ModelResult
  qwen?: ModelResult
  llama?: ModelResult
  runtime?: {
    openai?: number
    gpt4_1?: number
    gemini?: number
    qwen?: number
    llama?: number
  }
}

export interface HistoryItem {
  id: string
  timestamp: string
  description?: string
  results: AnalysisResults
}

