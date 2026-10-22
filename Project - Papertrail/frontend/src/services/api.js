const API = (import.meta.env.VITE_API_URL || "http://127.0.0.1:8000").replace(/\/$/, "");

async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(`${API}${path}`, {
      ...options,
      headers: {
        ...(options.body ? { "Content-Type": "application/json" } : {}),
        ...(options.headers || {})
      }
    });
  } catch {
    throw new Error(`Could not connect to the backend at ${API}. Start the FastAPI server and try again.`);
  }

  if (!response.ok) {
    let message = "Something went wrong. Please try again.";
    try {
      const body = await response.json();
      if (typeof body.detail === "string") message = body.detail;
    } catch {}
    throw new Error(message);
  }
  if (response.status === 204) return null;
  return response.json();
}

export const api = {
  getBooks: (params = {}) => {
    const query = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value && value !== "All") query.set(key, value);
    });
    return request(`/api/books${query.size ? `?${query.toString()}` : ""}`);
  },
  getStats: () => request("/api/stats"),
  getCategories: () => request("/api/categories"),
  createBook: (book) => request("/api/books", { method: "POST", body: JSON.stringify(book) }),
  updateBook: (id, book) => request(`/api/books/${id}`, { method: "PUT", body: JSON.stringify(book) }),
  deleteBook: (id) => request(`/api/books/${id}`, { method: "DELETE" }),
  borrowBook: (id) => request(`/api/books/${id}/borrow`, { method: "POST" }),
  returnBook: (id) => request(`/api/books/${id}/return`, { method: "POST" })
};
