import api from './api'

export async function getProfile($username) {
  const response = await api.get(`/api/v1/profile/${$username}`)
  return response.data
}