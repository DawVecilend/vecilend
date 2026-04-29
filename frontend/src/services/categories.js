import api from './api'

export async function getCategories(limit = null) {
  const params = limit ? { limit } : {}
  const response = await api.get('/categories', { params })
  return response.data.data
}