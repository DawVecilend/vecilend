import api from './api'

export async function getObjects(params = {}) {
  const response = await api.get('/objects', { params })
  return response.data.data
}

export async function getProduct(id) {
  const response = await api.get(`/objects/${id}`)
  return response.data
}