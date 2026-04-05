import api from './api'

export async function getCategories() {
  const response = await api.get('/api/v1/categories')
  return response.data
}