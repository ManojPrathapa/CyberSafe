// Save token & user info
export function saveAuth(token, user) {
  localStorage.setItem("jwt_token", token);
  localStorage.setItem("user", JSON.stringify(user));
}

// Get token for API calls
export function getToken() {
  return localStorage.getItem("jwt_token");
}

// Get stored user info
export function getUser() {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
}

// Remove auth info (for logout)
export function logout() {
  localStorage.removeItem("jwt_token");
  localStorage.removeItem("user");
  window.location.href = "/login";
}
