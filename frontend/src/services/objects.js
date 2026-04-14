import api from './api'

export async function getObjects(params = {}) {
  const response = await api.get('/api/v1/objects', { params })
  return response.data.data
}