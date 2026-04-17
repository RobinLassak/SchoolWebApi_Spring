import type { Grade, GradeFormData } from '@/types'
import apiClient from './client'

export const gradesApi = {
  getAll: async (): Promise<Grade[]> => {
    const { data } = await apiClient.get('/grades')
    return data
  },

  getById: async (id: number): Promise<Grade> => {
    const { data } = await apiClient.get(`/grades/${id}`)
    return data
  },

  create: async (payload: GradeFormData): Promise<Grade> => {
    const { data } = await apiClient.post('/grades', payload)
    return data
  },

  update: async (id: number, payload: GradeFormData): Promise<Grade> => {
    const { data } = await apiClient.put(`/grades/${id}`, payload)
    return data
  },

  delete: async (id: number): Promise<Grade> => {
    const { data } = await apiClient.delete(`/grades/${id}`)
    return data
  },
}
