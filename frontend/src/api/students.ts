import type { Student, StudentFormData } from '@/types'
import apiClient from './client'

export const studentsApi = {
  getAll: async (): Promise<Student[]> => {
    const { data } = await apiClient.get('/students')
    return data
  },

  create: async (payload: StudentFormData): Promise<Student> => {
    const { data } = await apiClient.post('/students', payload)
    return data
  },

  update: async (id: number, payload: StudentFormData): Promise<Student> => {
    const { data } = await apiClient.put(`/students/${id}`, payload)
    return data
  },

  delete: async (id: number): Promise<Student> => {
    const { data } = await apiClient.delete(`/students/${id}`)
    return data
  },
}
