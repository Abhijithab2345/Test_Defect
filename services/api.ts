import axios from 'axios'
import { AnalysisResults } from '@/types'

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

export interface AnalyzeRequest {
  image_url: string
  description?: string
}

export type AnalyzeResponse = AnalysisResults

export const analyzeImage = async (
  imageUrl: string,
  description?: string
): Promise<AnalyzeResponse> => {
  try {
    const response = await api.post<AnalyzeResponse>('/api/analyze', {
      image_url: imageUrl,
      description: description || '',
    })
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.detail || error.response.data?.message || 'Analysis failed'
      )
    } else if (error.request) {
      throw new Error('Unable to connect to the server. Please check if the backend is running.')
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}

export const getHistory = async (): Promise<any[]> => {
  try {
    const response = await api.get('/api/history')
    return response.data
  } catch (error: any) {
    if (error.response) {
      throw new Error(
        error.response.data?.detail || error.response.data?.message || 'Failed to fetch history'
      )
    } else if (error.request) {
      throw new Error('Unable to connect to the server. Please check if the backend is running.')
    } else {
      throw new Error(error.message || 'An unexpected error occurred')
    }
  }
}

