import api from './api';

/**
 * POST /api/v1/transactions/{id}/review
 */
export async function createReview(transactionId, { puntuacio, comentari }) {
  const res = await api.post(`/transactions/${transactionId}/review`, {
    puntuacio,
    comentari,
  });
  return res.data.data;
}

/**
 * GET /api/v1/users/{username}/reviews?role=&page=&per_page=
 */
export async function getUserReviews(username, { role = 'qualsevol', page = 1, per_page = 5 } = {}) {
  const res = await api.get(`/users/${username}/reviews`, {
    params: { role, page, per_page },
  });
  // { data: [...], meta: {current_page, last_page, total, avg} }
  return res.data;
}

/**
 * GET /api/v1/users/{username}/reviews/evolution
 */
export async function getReviewsEvolution(username) {
  const res = await api.get(`/users/${username}/reviews/evolution`);
  return res.data.data; // { propietari: [...], solicitant: [...] }
}