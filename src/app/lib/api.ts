const RAW_BASE =
  (typeof import.meta !== "undefined" && (import.meta as any).env?.VITE_API_BASE_URL) ||
  "http://localhost:8080";
export const API_BASE_URL = String(RAW_BASE).replace(/\/+$/, "");

const TOKEN_KEY = "myasset.accessToken";

export function getAccessToken(): string | null {
  try {
    return localStorage.getItem(TOKEN_KEY);
  } catch {
    return null;
  }
}

export function setAccessToken(token: string | null) {
  try {
    if (token) localStorage.setItem(TOKEN_KEY, token);
    else localStorage.removeItem(TOKEN_KEY);
  } catch {
    /* ignore */
  }
}

function extractBearer(header: string | null): string | null {
  if (!header) return null;
  const trimmed = header.trim();
  if (trimmed.toLowerCase().startsWith("bearer ")) return trimmed.slice(7).trim();
  return trimmed || null;
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.data = data;
  }
}

type RequestOptions = {
  method?: "GET" | "POST" | "PATCH" | "PUT" | "DELETE";
  query?: Record<string, string | number | boolean | undefined | null>;
  body?: unknown;
  headers?: Record<string, string>;
  skipAuth?: boolean;
  skipRefresh?: boolean;
};

async function parseBody(res: Response): Promise<unknown> {
  const ct = res.headers.get("content-type") || "";
  if (res.status === 204) return null;
  if (ct.includes("application/json")) {
    const text = await res.text();
    if (!text) return null;
    try {
      return JSON.parse(text);
    } catch {
      return text;
    }
  }
  const text = await res.text();
  return text || null;
}

let refreshPromise: Promise<boolean> | null = null;

async function refreshAccessToken(): Promise<boolean> {
  if (refreshPromise) return refreshPromise;
  refreshPromise = (async () => {
    try {
      const res = await fetch(`${API_BASE_URL}/api/auth/refresh`, {
        method: "POST",
        credentials: "include",
      });
      if (!res.ok) return false;
      const token = extractBearer(res.headers.get("authorization"));
      if (token) setAccessToken(token);
      return !!token;
    } catch {
      return false;
    } finally {
      refreshPromise = null;
    }
  })();
  return refreshPromise;
}

async function doRequest<T>(path: string, opts: RequestOptions): Promise<{ data: T; res: Response }> {
  const url = new URL(path.startsWith("http") ? path : `${API_BASE_URL}${path}`);
  if (opts.query) {
    for (const [k, v] of Object.entries(opts.query)) {
      if (v === undefined || v === null || v === "") continue;
      url.searchParams.set(k, String(v));
    }
  }

  const headers: Record<string, string> = { Accept: "application/json", ...(opts.headers || {}) };
  const hasBody = opts.body !== undefined && opts.body !== null;
  if (hasBody && !(opts.body instanceof FormData)) headers["Content-Type"] = "application/json";

  if (!opts.skipAuth) {
    const token = getAccessToken();
    if (token) headers.Authorization = `Bearer ${token}`;
    // eslint-disable-next-line no-console
    console.log("[api] →", opts.method || "GET", path, { hasAuth: !!token });
  }

  const res = await fetch(url.toString(), {
    method: opts.method || "GET",
    headers,
    credentials: "include",
    body: hasBody ? (opts.body instanceof FormData ? opts.body : JSON.stringify(opts.body)) : undefined,
  });

  if (res.status === 401 && !opts.skipAuth && !opts.skipRefresh) {
    const ok = await refreshAccessToken();
    if (ok) {
      return doRequest<T>(path, { ...opts, skipRefresh: true });
    }
  }

  const data = (await parseBody(res)) as T;
  if (!res.ok) {
    const message =
      (data && typeof data === "object" && "message" in (data as any) && String((data as any).message)) ||
      `HTTP ${res.status}`;
    throw new ApiError(message, res.status, data);
  }
  return { data, res };
}

export const api = {
  get: async <T>(path: string, query?: RequestOptions["query"], opts: Omit<RequestOptions, "method" | "query" | "body"> = {}) => {
    const { data } = await doRequest<T>(path, { ...opts, method: "GET", query });
    return data;
  },
  post: async <T>(path: string, body?: unknown, opts: Omit<RequestOptions, "method" | "body"> = {}) => {
    const { data } = await doRequest<T>(path, { ...opts, method: "POST", body });
    return data;
  },
  postFull: async <T>(path: string, body?: unknown, opts: Omit<RequestOptions, "method" | "body"> = {}) => {
    return doRequest<T>(path, { ...opts, method: "POST", body });
  },
  patch: async <T>(path: string, body?: unknown, opts: Omit<RequestOptions, "method" | "body"> = {}) => {
    const { data } = await doRequest<T>(path, { ...opts, method: "PATCH", body });
    return data;
  },
  del: async <T>(path: string, opts: Omit<RequestOptions, "method" | "body"> = {}) => {
    const { data } = await doRequest<T>(path, { ...opts, method: "DELETE" });
    return data;
  },
};

export async function captureAuthFromResponse(res: Response) {
  const raw = res.headers.get("authorization");
  const token = extractBearer(raw);
  // eslint-disable-next-line no-console
  console.log("[auth] capture response header →", { raw, token: token ? token.slice(0, 16) + "..." : null });
  if (token) setAccessToken(token);
  return token;
}

export function clearAuth() {
  setAccessToken(null);
}

export function isAuthenticated() {
  return !!getAccessToken();
}
