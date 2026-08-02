export const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.status = status;
  }
}

export function getToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem("zovadri_token");
}

export function setToken(token: string) {
  localStorage.setItem("zovadri_token", token);
}

export function getUser(): any | null {
  if (typeof window === "undefined") return null;
  const raw = localStorage.getItem("zovadri_user");
  return raw ? JSON.parse(raw) : null;
}

export function setUser(user: any) {
  localStorage.setItem("zovadri_user", JSON.stringify(user));
}

export function clearSession() {
  localStorage.removeItem("zovadri_token");
  localStorage.removeItem("zovadri_user");
}

export async function api<T = any>(path: string, options: RequestInit = {}): Promise<T> {
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  const token = getToken();
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const res = await fetch(`${API_URL}${path}`, { ...options, headers });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) {
    throw new ApiError(data.error || "حدث خطأ غير متوقع", res.status);
  }
  return data as T;
}

export const egp = (n: number) =>
  new Intl.NumberFormat("ar-EG", { style: "currency", currency: "EGP", maximumFractionDigits: 0 }).format(n);
