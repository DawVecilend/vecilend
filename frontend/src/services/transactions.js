import api from './api'

/**
 * POST /api/v1/transactions
 *
 * Crea una sol·licitud (préstec/lloguer). Requereix Bearer token (interceptor d'axios).
 *
 * @param {Object} payload
 * @param {number} payload.objecte_id
 * @param {string} payload.data_inici  format YYYY-MM-DD
 * @param {string} payload.data_fi     format YYYY-MM-DD
 * @param {?string} payload.missatge
 */
export async function createTransaction({ objecte_id, data_inici, data_fi, missatge }) {
  const response = await api.post('/transactions', {
    objecte_id,
    data_inici,
    data_fi,
    missatge,
  })
  return response.data.data
}

/**
 * GET /api/v1/transactions
 *
 * @param {Object} params
 * @param {'requester'|'owner'|null} params.role
 * @param {'pendent'|'acceptat'|'rebutjat'|'finalitzat'|null} params.status
 * @param {number|null} params.objecte_id
 */
export async function getTransactions({ role = null, status = null, objecte_id = null } = {}) {
  const query = {}
  if (role) query.role = role
  if (status) query.status = status
  if (objecte_id) query.objecte_id = objecte_id

  const response = await api.get('/transactions', { params: query })
  return response.data.data
}