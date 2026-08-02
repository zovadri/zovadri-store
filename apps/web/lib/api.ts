const API = (process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000").replace(/\/$/, "");

export const apiUrl = API;

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("zovadri_token");
}

export function setToken(token: string | null) {
  if (typeof window === "undefined") return;
  if (token) localStorage.setItem("zovadri_token", token);
  else localStorage.removeItem("zovadri_token");
}

export function getUser(): any | null {
  if (typeof window === "undefined") return null;
  try {
    return JSON.parse(localStorage.getItem("zovadri_user") || "null");
  } catch {
    return null;
  }
}

export function setUser(user: any | null) {
  if (typeof window === "undefined") return;
  if (user) localStorage.setItem("zovadri_user", JSON.stringify(user));
  else localStorage.removeItem("zovadri_user");
}

export function logout() {
  setToken(null);
  setUser(null);
  if (typeof window !== "undefined") window.location.href = "/login";
}

export async function api<T = any>(path: string, opts: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json", ...(opts.headers as any) };
  const token = getToken();
  if (token) headers.Authorization = `Bearer ${token}`;
  const res = await fetch(`${API}${path}`, { ...opts, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data?.error || data?.message || "حدث خطأ في الاتصال");
  return data as T;
}

export const formatPrice = (n: number | string | null | undefined) =>
  `${Number(n ?? 0).toLocaleString("en-US")} ج.م`;