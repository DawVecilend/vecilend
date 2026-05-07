import api from "./api";

export async function getFavorites() {
  const response = await api.get("/favorites");

  return {
    favorites: Array.isArray(response.data.favorites)
      ? response.data.favorites
      : [],
    total: response.data.total || 0,
  };
}

export async function addFavorite(objectId) {
  const response = await api.post(`/objects/${objectId}/favorite`);
  return response.data;
}

export async function removeFavorite(objectId) {
  const response = await api.delete(`/objects/${objectId}/favorite`);
  return response.data;
}