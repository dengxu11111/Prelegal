const API_BASE = process.env.NEXT_PUBLIC_API_BASE ?? "";

const TOKEN_KEY = "prelegal_token";

export const tokenStore = {
  get: (): string | null => {
    if (typeof window === "undefined") return null;
    return localStorage.getItem(TOKEN_KEY);
  },
  set: (token: string): void => {
    localStorage.setItem(TOKEN_KEY, token);
  },
  clear: (): void => {
    localStorage.removeItem(TOKEN_KEY);
  },
};

async function request<T>(path: string, options: RequestInit = {}): Promise<T> {
  const token = tokenStore.get();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) {
    headers["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    const error = await res.json().catch(() => ({ detail: "Request failed" }));
    throw new Error(error.detail ?? "Request failed");
  }

  return res.json() as Promise<T>;
}

export interface AuthResponse {
  access_token: string;
  token_type: string;
}

export interface UserProfile {
  id: number;
  email: string;
  full_name: string;
}

export const api = {
  auth: {
    signup: (
      email: string,
      password: string,
      full_name: string
    ): Promise<AuthResponse> =>
      request("/api/auth/signup", {
        method: "POST",
        body: JSON.stringify({ email, password, full_name }),
      }),

    signin: (email: string, password: string): Promise<AuthResponse> =>
      request("/api/auth/signin", {
        method: "POST",
        body: JSON.stringify({ email, password }),
      }),

    me: (): Promise<UserProfile> => request("/api/auth/me"),
  },
};
