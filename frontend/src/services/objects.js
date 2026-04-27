import api from './api'

export async function getObjects(params = {}) {
  const response = await api.get('/objects', { params })
  return response.data.data
}

export async function getProduct(id) {
  const response = await api.get(`/objects/${id}`)
  return response.data
}

export async function getNearbyObjects({ lat, lng, radius = 5000 } = {}) {
  const response = await api.get('/objects/nearby', {
    params: { lat, lng, radius },
  })
  return response.data.data
}

export async function createObject(payload) {
  const response = await api.post('/objects', payload, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  })

  return response.data
}