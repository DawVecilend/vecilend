import api from "./api";

/**
 * GET /api/v1/chats — Llista totes les converses on participa l'usuari.
 */
export async function getChats() {
  const response = await api.get("/chats");
  return response.data.data;
}

/**
 * POST /api/v1/chats — Crea o recupera una conversa amb un altre usuari.
 *
 * @param {Object} payload
 * @param {number} payload.user_id      ID de l'altre usuari
 * @param {?number} payload.objecte_id  Context opcional (objecte que origina la conversa)
 * @param {?string} payload.missatge    Primer missatge opcional
 */
export async function createChat({
  user_id,
  objecte_id = null,
  missatge = null,
}) {
  const response = await api.post("/chats", { user_id, objecte_id, missatge });
  return response.data.data;
}

/**
 * GET /api/v1/chats/{id}
 */
export async function getChat(id) {
  const response = await api.get(`/chats/${id}`);
  return response.data.data;
}

/**
 * GET /api/v1/chats/{id}/messages — Missatges paginats (antics primer).
 */
export async function getChatMessages(id, { page = 1, per_page = 50 } = {}) {
  const response = await api.get(`/chats/${id}/messages`, {
    params: { page, per_page },
  });
  return {
    data: response.data.data,
    meta: response.data.meta || null,
  };
}

/**
 * POST /api/v1/chats/{id}/messages — Envia un missatge.
 *
 * @param {Object} payload
 * @param {string} payload.contingut    Text del missatge (obligatori)
 * @param {?number} payload.objecte_id  Objecte associat (opcional)
 * @param {?number} payload.respon_a_id Missatge citat (opcional)
 */
export async function sendChatMessage(id, payload) {
  // Acceptem string per compatibilitat amb cridants antics
  const body = typeof payload === "string" ? { contingut: payload } : payload;

  const response = await api.post(`/chats/${id}/messages`, body);
  return response.data.data;
}

/**
 * PUT /api/v1/chats/{id}/read — Marca tots els missatges com a llegits.
 */
export async function markChatAsRead(id) {
  const response = await api.put(`/chats/${id}/read`);
  return response.data;
}

/**
 * GET /api/v1/me/unread-counts
 */
export async function getUnreadCounts() {
  const response = await api.get("/me/unread-counts");
  return response.data.data;
}
