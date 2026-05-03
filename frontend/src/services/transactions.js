import api from './api'

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
 * GET /api/v1/transactions?role=&status=&objecte_id=
 *
 * Llista les sol·licituds en què participa l'usuari autenticat.
 *
 * Filtres:
 *   - role: 'requester' (les que l'usuari ha fet) | 'owner' (les que l'usuari ha rebut com a propietari)
 *           Si s'omet, retorna les dues llistes barrejades.
 *   - status: 'pendent' | 'acceptat' | 'rebutjat' | 'finalitzat'
 *   - objecte_id: Filtra les sol·licituds per un objecte específic (si s'omet, es mostren totes les sol·licituds).
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

/** PUT /api/v1/transactions/{id}/accept — només propietari */
export async function acceptTransaction(id) {
  const response = await api.put(`/transactions/${id}/accept`)
  return response.data.data
}

/** PUT /api/v1/transactions/{id}/reject — només propietari */
export async function rejectTransaction(id) {
  const response = await api.put(`/transactions/${id}/reject`)
  return response.data.data
}

/** PUT /api/v1/transactions/{id}/return — només propietari, registra devolució */
export async function returnTransaction(id) {
  const response = await api.put(`/transactions/${id}/return`)
  return response.data.data
}