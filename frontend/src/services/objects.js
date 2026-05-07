import api from './api'

export async function getObjects(params = {}) {
  const response = await api.get('/objects', { params })

  return {
    data: response.data.data,
    meta: response.data.meta || null,
    links: response.data.links || null,
  }
}

export async function getProduct(id) {
  const response = await api.get(`/objects/${id}`)
  return response.data.data
}

export async function getNearbyObjects(params = {}) {
  const response = await api.get('/objects/nearby', { params })

  return {
    data: response.data.data,
    meta: response.data.meta || null,
    links: response.data.links || null,
  }
}

export async function createObject(payload) {
  const response = await api.post('/objects', payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

export async function updateObject(id, payload) {
  const response = await api.put(`/objects/${id}`, payload, {
    headers: { 'Content-Type': 'multipart/form-data' },
  })

  return response.data
}

export async function updateObjectStatus(product, status) {
  const formData = new FormData()

  formData.append("nom", product.nom || "")
  formData.append("preu_diari", product.preu_diari || 0)
  formData.append("descripcio", product.descripcio || "")
  formData.append("categoria_id", product.categoria?.id || product.categoria_id || "")
  formData.append("subcategoria_id", product.subcategoria?.id || product.subcategoria_id || "")
  formData.append("tipus", product.tipus || "lloguer")
  formData.append("estat", status)

  const response = await api.put(`/objects/${product.id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  })

  return response.data
}

export async function deleteObject(id) {
  const response = await api.delete(`/objects/${id}`)
  return response.data
}