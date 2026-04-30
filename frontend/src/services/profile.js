import api from "./api";

export const getProfile = async (username) => {
  const response = await api.get(`/profile/${username}`);
  return {
    user:           response.data.data,
    latest_objects: response.data.latest_objects || [],
  };
};

export const updateProfile = async (username, data) => {
  const formData = new FormData();
  formData.append("_method", "PUT");
  
  formData.append("nom", data.nom);
  formData.append("cognoms", data.cognoms); // Añadido
  if (data.telefon) formData.append("telefon", data.telefon);
  if (data.direccio) formData.append("direccio", data.direccio);
  if (data.biography) formData.append("biography", data.biography);
  if (data.radi_proximitat) formData.append("radi_proximitat", data.radi_proximitat); // Añadido
  if (data.avatar) formData.append("avatar", data.avatar);

  const response = await api.post(`/profile/${username}/editing`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return response.data.data;
};

export const getUserObjects = async (username) => {
  const response = await api.get(`/profile/${username}/objects`);
  return response.data.data;
}

export const deleteProfile = async (username) => {
  const response = await api.delete(`/profile/${username}`);
  return response.data;
};


export const updatePassword = async (username, passwordData) => {
  const response = await api.put(`/profile/${username}/password`, passwordData);
  return response.data;
};