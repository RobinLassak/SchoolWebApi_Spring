import type { Subject, SubjectFormData } from '@/types'
import apiClient from './client'

export const subjectsApi = {
  getAll: async (): Promise<Subject[]> => {
    const { data } = await apiClient.get('/subjects')
    return data
  },

  create: async (payload: SubjectFormData): Promise<Subject> => {
    const { data } = await apiClient.post('/subjects', payload)
    return data
  },

  update: async (id: number, payload: SubjectFormData): Promise<Subject> => {
    const { data } = await apiClient.put(`/subjects/${id}`, payload)
    return data
  },

  delete: async (id: number): Promise<Subject> => {
    const { data } = await apiClient.delete(`/subjects/${id}`)
    return data
  },
}
