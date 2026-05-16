/**
 * Store en memoria para borradores de chat (estilo WhatsApp).
 *
 * Los borradores son privados del usuario autenticado y viven solo en
 * la memoria del navegador durante la sesión. Si el usuario cambia de
 * cuenta o cierra la pestaña, se pierden.
 *
 * Importante: usamos una clave compuesta `${userId}:${chatId}` para que
 * dos cuentas distintas que comparten el mismo navegador (típico en
 * desarrollo y testing) no vean los borradores del otro.
 */

const drafts = {};
const listeners = new Set();

let currentUserId = null;

function notify() {
  listeners.forEach((fn) => fn());
}

function keyFor(chatId) {
  if (chatId == null || currentUserId == null) return null;
  return `${currentUserId}:${chatId}`;
}

/**
 * Establece el usuario actual. Debe llamarse al iniciar sesión y al
 * cambiar de usuario. Los borradores del usuario anterior NO se borran
 * (siguen accesibles si vuelve a iniciar sesión en la misma pestaña),
 * pero dejan de ser visibles para el nuevo usuario.
 */
export function setCurrentUser(userId) {
  if (currentUserId !== userId) {
    currentUserId = userId;
    notify();
  }
}

export function getDraft(chatId) {
  const k = keyFor(chatId);
  if (!k) return "";
  return drafts[k] ?? "";
}

export function setDraft(chatId, text) {
  const k = keyFor(chatId);
  if (!k) return;
  const trimmed = (text ?? "").trim();
  if (trimmed) {
    drafts[k] = text;
  } else {
    delete drafts[k];
  }
  notify();
}

export function clearDraft(chatId) {
  const k = keyFor(chatId);
  if (!k) return;
  if (drafts[k] !== undefined) {
    delete drafts[k];
    notify();
  }
}

export function hasDraft(chatId) {
  const k = keyFor(chatId);
  if (!k) return false;
  return !!drafts[k];
}

export function subscribeToDrafts(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}
