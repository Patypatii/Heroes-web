export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE";

// Backend API base URL - points to the backend server
// Prefer env override; if on GitHub Pages, default to hosted production API
const isGithubPages = typeof window !== 'undefined' && window.location.hostname.endsWith('github.io');
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string)
  || (isGithubPages ? 'https://heroes-server-api.onrender.com/api' : 'http://localhost:5001/api');

export function getToken() {
  return localStorage.getItem("auth_token");
}

export function setAuth(token: string, user: any) {
  localStorage.setItem("auth_token", token);
  localStorage.setItem("auth_user", JSON.stringify(user));
}

export function clearAuth() {
  localStorage.removeItem("auth_token");
  localStorage.removeItem("auth_user");
}

export async function api<T = any>(path: string, opts: { method?: HttpMethod; body?: any; headers?: Record<string, string> } = {}) {
  const token = getToken();
  console.log("🔑 API call - Token exists:", !!token);
  console.log("🔑 API call - Token:", token ? `${token.substring(0, 20)}...` : "No token");

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(opts.headers || {}),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  // Ensure path starts with / for proper URL construction
  const fullPath = path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;
  console.log("🌐 API call - Full URL:", fullPath);
  console.log("🌐 API call - Headers:", headers);

  const res = await fetch(fullPath, {
    method: opts.method || "GET",
    headers,
    body: opts.body ? JSON.stringify(opts.body) : undefined,
  });

  console.log("📡 API call - Response status:", res.status);
  console.log("📡 API call - Response ok:", res.ok);

  if (!res.ok) {
    const errorText = await res.text();
    console.error("❌ API call - Error response:", errorText);
    throw new Error(errorText);
  }

  const responseData = await res.json();
  console.log("✅ API call - Response data:", responseData);
  return responseData as T;
}

export async function uploadFile(path: string, file: File) {
  const token = getToken();
  const fd = new FormData();
  fd.append("file", file);

  // Ensure path starts with / for proper URL construction
  const fullPath = path.startsWith('/') ? `${API_BASE_URL}${path}` : `${API_BASE_URL}/${path}`;

  const res = await fetch(fullPath, {
    method: "POST",
    headers: token ? { Authorization: `Bearer ${token}` } : undefined,
    body: fd,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json();
}
