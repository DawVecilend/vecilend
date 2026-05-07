import api from "./api";

/**
 * GET /api/v1/chats — Llista totes les converses on participa l'usuari.
 * Retorna un array de converses amb últim missatge i comptador no llegits.
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
 * GET /api/v1/chats/{id} — Detall d'una conversa (sense missatges).
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
 */
export async function sendChatMessage(id, contingut) {
  const response = await api.post(`/chats/${id}/messages`, { contingut });
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
 * GET /api/v1/me/unread-counts — Comptadors per a les bombolles.
 */
export async function getUnreadCounts() {
  const response = await api.get("/me/unread-counts");
  return response.data.data;
}
