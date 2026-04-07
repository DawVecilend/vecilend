import api from './api'

export async function getObjects() {
  const response = await api.get('/api/v1/objects')
  return response.data
}