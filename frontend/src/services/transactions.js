import api from "./api";

/**
 * POST /api/v1/transactions — Crear sol·licitud.
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
 * GET /api/v1/transactions
 *   view: 'requests' | 'transactions'
 *   role: 'requester' | 'owner'
 *   status: estat dins l'àmbit
 *
 * Retorna { data, meta, counts }.
 */
export async function getTransactions({
  view = "requests",
  role = null,
  status = null,
  objecte_id = null,
  page = 1,
  per_page = 8,
} = {}) {
  const params = { view, page, per_page };
  if (role) params.role = role;
  if (status) params.status = status;
  if (objecte_id) params.objecte_id = objecte_id;

  const response = await api.get("/transactions", { params });
  return {
    data: response.data.data,
    meta: response.data.meta || null,
    counts: response.data.counts || {},
    links: response.data.links || null,
  };
}

export async function acceptTransaction(id) {
  const response = await api.put(`/transactions/${id}/accept`);
  return response.data.data;
}

export async function rejectTransaction(id) {
  const response = await api.put(`/transactions/${id}/reject`);
  return response.data.data;
}

export async function returnTransaction(id) {
  const response = await api.put(`/transactions/${id}/return`);
  return response.data.data;
}

/** Cancel·la una solicitud pendent o una transacció en curs no efectuada. */
export async function cancelTransaction(id) {
  const response = await api.put(`/transactions/${id}/cancel`);
  return response.data.data;
}

/** Mock de pagament — registra un Pagament 'completat' al backend. */
export async function payTransaction(id) {
  const response = await api.post(`/transactions/${id}/payment`);
  return response.data.data;
}
