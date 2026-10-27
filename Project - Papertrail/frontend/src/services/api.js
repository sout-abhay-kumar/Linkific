const API = (import.meta.env.VITE_API_URL || "").replace(/\/$/, "");

let csrfToken = "";
let csrfRequest;

async function fetchCsrfToken() {
  if (!csrfRequest) {
    csrfRequest = (async () => {
      let response;
      try {
        response = await fetch(`${API}/api/auth/csrf`, {
          credentials: "include",
        });
      } catch {
        throw new Error(
          `Could not connect to the backend at ${API || "the configured API"}. Start the FastAPI server and try again.`,
        );
      }
      if (!response.ok) {
        throw new Error("Could not initialize a secure session. Please try again.");
      }
      const body = await response.json();
      csrfToken = body.csrf_token;
      return csrfToken;
    })().finally(() => {
      csrfRequest = undefined;
    });
  }
  return csrfRequest;
}

function errorMessage(body, fallback) {
  if (typeof body?.detail === "string") return body.detail;
  if (Array.isArray(body?.detail)) {
    const firstError = body.detail.find((item) => typeof item?.msg === "string");
    if (firstError) return firstError.msg;
  }
  return fallback;
}

async function request(path, options = {}, retryCsrf = true) {
  const method = (options.method || "GET").toUpperCase();
  const headers = {
    ...(options.body ? { "Content-Type": "application/json" } : {}),
    ...(options.headers || {}),
  };
  if (!["GET", "HEAD", "OPTIONS"].includes(method)) {
    headers["X-CSRF-Token"] = csrfToken || (await fetchCsrfToken());
  }

  let response;
  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      method,
      credentials: "include",
      headers,
    });
  } catch {
    throw new Error(
      `Could not connect to the backend at ${API || "the configured API"}. Start the FastAPI server and try again.`,
    );
  }

  if (!response.ok) {
    let body;
    const text = await response.text();
    if (text) {
      try {
        body = JSON.parse(text);
      } catch {
        body = undefined;
      }
    }
    if (
      response.status === 403 &&
      body?.detail === "CSRF validation failed." &&
      retryCsrf
    ) {
      csrfToken = "";
      await fetchCsrfToken();
      return request(path, options, false);
    }
    if (
      response.status === 401 &&
      !["/api/auth/login", "/api/auth/signup", "/api/auth/me"].includes(path)
    ) {
      window.dispatchEvent(new Event("papertrail:unauthorized"));
    }
    const error = new Error(
      errorMessage(body, "Something went wrong. Please try again."),
    );
    error.status = response.status;
    throw error;
  }

  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getCsrf: fetchCsrfToken,
  getBooks: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "All") query.set(key, value);
    });
    return request(`/api/books${query.size ? `?${query.toString()}` : ""}`);
  },
  getBook: (id) => request(`/api/books/${id}`),
  getStats: () => request("/api/stats"),
  getCategories: () => request("/api/categories"),
  createBook: (book) =>
    request("/api/books", { method: "POST", body: JSON.stringify(book) }),
  updateBook: (id, book) =>
    request(`/api/books/${id}`, { method: "PUT", body: JSON.stringify(book) }),
  deleteBook: (id) => request(`/api/books/${id}`, { method: "DELETE" }),
  borrowBook: (id) => request(`/api/books/${id}/borrow`, { method: "POST" }),
  returnBook: (id) => request(`/api/books/${id}/return`, { method: "POST" }),
  signup: (credentials) =>
    request("/api/auth/signup", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  login: (credentials) =>
    request("/api/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    }),
  getCurrentUser: () => request("/api/auth/me"),
  logout: async () => {
    await request("/api/auth/logout", { method: "POST" });
    csrfToken = "";
  },
  updateProfile: (profile) =>
    request("/api/users/me", {
      method: "PATCH",
      body: JSON.stringify(profile),
    }),
  changePassword: async (passwords) => {
    const result = await request("/api/auth/change-password", {
      method: "POST",
      body: JSON.stringify(passwords),
    });
    csrfToken = "";
    return result;
  },
  forgotPassword: (email) =>
    request("/api/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify({ email }),
    }),
  resetPassword: (token, newPassword) =>
    request("/api/auth/reset-password", {
      method: "POST",
      body: JSON.stringify({ token, new_password: newPassword }),
    }),
};
