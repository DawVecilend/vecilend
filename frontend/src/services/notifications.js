import api from "./api";

/**
 * GET /api/v1/notifications — Llistat paginat.
 */
export async function getNotifications({ page = 1, per_page = 20 } = {}) {
  const response = await api.get("/notifications", {
    params: { page, per_page },
  });
  return {
    data: response.data.data,
    meta: response.data.meta || null,
  };
}

/**
 * PUT /api/v1/notifications/{id}/read
 */
export async function markNotificationAsRead(id) {
  const response = await api.put(`/notifications/${id}/read`);
  return response.data.data;
}

/**
 * PUT /api/v1/notifications/read-all
 */
export async function markAllNotificationsAsRead() {
  const response = await api.put("/notifications/read-all");
  return response.data;
}

/**
 * DELETE /api/v1/notifications/{id}
 */
export async function deleteNotification(id) {
  const response = await api.delete(`/notifications/${id}`);
  return response.data;
}
