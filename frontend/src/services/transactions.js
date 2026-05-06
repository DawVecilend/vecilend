import api from "./api";

/**
 * POST /api/v1/transactions — Crear una sol·licitud (préstec/lloguer).
 * Requereix Bearer token (interceptor d'axios).
 *
 * @param {Object} payload
 * @param {number} payload.objecte_id
 * @param {string} payload.data_inici  format YYYY-MM-DD
 * @param {string} payload.data_fi     format YYYY-MM-DD
 * @param {?string} payload.missatge
 */
export async function createTransaction({
  objecte_id,
  data_inici,
  data_fi,
  missatge,
}) {
  const response = await api.post("/transactions", {
    objecte_id,
    data_inici,
    data_fi,
    missatge,
  });
  return response.data.data;
}

/**
 * GET /api/v1/transactions?role=&status=&objecte_id=&page=&per_page=
 *
 * Retorna {data, meta, links} (Laravel paginator).
 */
export async function getTransactions({
  role = null,
  status = null,
  objecte_id = null,
  page = 1,
  per_page = 8,
} = {}) {
  const query = { page, per_page };
  if (role) query.role = role;
  if (status) query.status = status;
  if (objecte_id) query.objecte_id = objecte_id;

  const response = await api.get("/transactions", { params: query });
  return {
    data: response.data.data,
    meta: response.data.meta || null,
    links: response.data.links || null,
  };
}

/** PUT /api/v1/transactions/{id}/accept — només propietari */
export async function acceptTransaction(id) {
  const response = await api.put(`/transactions/${id}/accept`);
  return response.data.data;
}

/** PUT /api/v1/transactions/{id}/reject — només propietari */
export async function rejectTransaction(id) {
  const response = await api.put(`/transactions/${id}/reject`);
  return response.data.data;
}

/** PUT /api/v1/transactions/{id}/return — només propietari, registra devolució */
export async function returnTransaction(id) {
  const response = await api.put(`/transactions/${id}/return`);
  return response.data.data;
}
