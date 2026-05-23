import api from "./api";

export async function setupTwoFactor() {
  const response = await api.post("/2fa/setup");
  return response.data.data;
}

export async function confirmTwoFactor(code) {
  const response = await api.post("/2fa/confirm", { code });
  return response.data;
}

export async function disableTwoFactor({ password, code }) {
  const payload = { code };
  if (password) payload.password = password;
  const response = await api.post("/2fa/disable", payload);
  return response.data;
}

export async function getRecoveryCodes({ password, code }) {
  const payload = { code };
  if (password) payload.password = password;
  const response = await api.post("/2fa/recovery-codes", payload);
  return response.data.data;
}

export async function regenerateRecoveryCodes({ password, code }) {
  const payload = { code };
  if (password) payload.password = password;
  const response = await api.post("/2fa/recovery-codes/regenerate", payload);
  return response.data.data;
}

export async function verifyLogin2fa({ two_factor_token, code }) {
  const response = await api.post("/login/2fa", { two_factor_token, code });
  return response.data;
}
