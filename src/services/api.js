const API_BASE = (import.meta.env.VITE_API_BASE || "http://localhost:8080").replace(/\/$/, "");

export async function parseApiResponse(res) {
  const text = await res.text();
  let data = null;

  if (text) {
    try {
      data = JSON.parse(text);
    } catch {
      data = { mensagem: text };
    }
  }

  if (!res.ok) {
    const message = data?.mensagem || `Erro HTTP ${res.status}`;
    throw new Error(message);
  }

  return data;
}

function buildHeaders(extra = {}, options = {}) {
  const { skipAuth = false } = options;
  const token = localStorage.getItem("token");

  return {
    ...(!skipAuth && token ? { Authorization: `Bearer ${token}` } : {}),
    ...extra,
  };
}

export const api = {
  get: (url, options = {}) =>
    fetch(`${API_BASE}${url}`, {
      headers: buildHeaders({}, options),
    }).then(parseApiResponse),

  post: (url, data, options = {}) =>
    fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: buildHeaders({ "Content-Type": "application/json" }, options),
      body: JSON.stringify(data),
    }).then(parseApiResponse),

  put: (url, data, options = {}) =>
    fetch(`${API_BASE}${url}`, {
      method: "PUT",
      headers: buildHeaders({ "Content-Type": "application/json" }, options),
      body: JSON.stringify(data),
    }).then(parseApiResponse),

  delete: (url, options = {}) =>
    fetch(`${API_BASE}${url}`, {
      method: "DELETE",
      headers: buildHeaders({}, options),
    }).then(parseApiResponse),

  upload: (url, file, options = {}) => {
    const formData = new FormData();
    formData.append("file", file);

    return fetch(`${API_BASE}${url}`, {
      method: "POST",
      headers: buildHeaders({}, options),
      body: formData,
    }).then(parseApiResponse);
  },
};