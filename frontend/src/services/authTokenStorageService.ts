const AUTH_TOKEN_KEY = "lifehub_token";
const KEEP_CONNECTED_KEY = "lifehub_keep_connected";

export function saveAuthToken(token: string, keepConnected: boolean) {
  clearAuthToken();

  if (keepConnected) {
    localStorage.setItem(AUTH_TOKEN_KEY, token);
    localStorage.setItem(KEEP_CONNECTED_KEY, "true");
    return;
  }

  sessionStorage.setItem(AUTH_TOKEN_KEY, token);
  localStorage.removeItem(KEEP_CONNECTED_KEY);
}

export function getAuthToken() {
  return (
    localStorage.getItem(AUTH_TOKEN_KEY) ||
    sessionStorage.getItem(AUTH_TOKEN_KEY)
  );
}

export function clearAuthToken() {
  localStorage.removeItem(AUTH_TOKEN_KEY);
  sessionStorage.removeItem(AUTH_TOKEN_KEY);
  localStorage.removeItem(KEEP_CONNECTED_KEY);
}

export function getKeepConnectedPreference() {
  return localStorage.getItem(KEEP_CONNECTED_KEY) === "true";
}