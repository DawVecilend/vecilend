import api from './api'

export async function getProfile(username) {
  const response = await api.get(`/profile/${username}`)
  return response.data
}