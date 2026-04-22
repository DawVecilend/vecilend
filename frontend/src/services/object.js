import api from './api'

export async function getProduct($id) {
  const response = await api.get(`/api/v1/objects/${$id}`)
  return response.data
}