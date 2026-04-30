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