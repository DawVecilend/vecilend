import api from './api'

export async function getProduct(id) {
  const response = await api.get(`/objects/${id}`)
  return response.data.data
}