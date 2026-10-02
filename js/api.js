class ApiError extends Error { constructor(m, status, errors) { super(m); this.status = status; this.errors = errors; } }
const STATUS_MSG = {
  401: "Session expired. Please log in again.",
  403: "You do not have permission to perform this action.",
  404: "The requested resource was not found.",
  429: "Too many requests. Please wait a moment and try again.",
  500: "Something went wrong on the server. Please try again later."
};
async function request(method, path, { body, admin = false, auth = true, query } = {}) {
  const url = new URL(API_BASE_URL + path);
  if (query) Object.entries(query).forEach(([k, v]) => v !== "" && v != null && url.searchParams.set(k, v));
  const headers = { Accept: "application/json" };
  const token = localStorage.getItem(admin ? ADMIN_TOKEN_KEY : TOKEN_KEY);
  if (auth && token) headers.Authorization = `Bearer ${token}`;
  const opts = { method, headers };
  if (body instanceof FormData) opts.body = body;
  else if (body) { headers["Content-Type"] = "application/json"; opts.body = JSON.stringify(body); }
  let res;
  try { res = await fetch(url, opts); }
  catch { throw new ApiError("Unable to connect to Gadget Hub. Please check your internet connection.", 0); }
  let json = null;
  try { json = await res.json(); } catch {}
  if (res.ok) return json;
  if (res.status === 401 && auth && token) localStorage.removeItem(admin ? ADMIN_TOKEN_KEY : TOKEN_KEY);
  const msg = (res.status === 400 || res.status === 422 || res.status === 409) && json?.message ? json.message
    : STATUS_MSG[res.status] || json?.message || (res.status >= 500 ? STATUS_MSG[500] : "Something went wrong. Please try again.");
  throw new ApiError(msg, res.status, json?.errors);
}
const api = {
  get: (p, o) => request("GET", p, o), post: (p, b, o) => request("POST", p, { ...o, body: b }),
  put: (p, b, o) => request("PUT", p, { ...o, body: b }), patch: (p, b, o) => request("PATCH", p, { ...o, body: b }),
  delete: (p, o) => request("DELETE", p, o)
};
