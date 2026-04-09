async function request(path, options) {
    const res = await fetch(path, {
        headers: { "Content-Type": "application/json" },
        ...options
    });

    const isJson = res.headers.get("content-type")?.includes("application/json");
    const data = isJson ? await res.json() : null;

    if (!res.ok) {
        const message = data?.message || "request failed";
        throw new Error(message);
    }

    return data;
}

export function getTransactions() {
    return request("/api/transactions");
}

export function getTransaction(id) {
    return request(`/api/transactions/${id}`);
}

export function createTransaction(payload) {
    return request("/api/transactions", { method: "POST", body: JSON.stringify(payload) });
}

export function updateTransaction(id, payload) {
    return request(`/api/transactions/${id}`, { method: "PUT", body: JSON.stringify(payload) });
}

export function deleteTransaction(id) {
    return request(`/api/transactions/${id}`, { method: "DELETE" });
}

export function getSummary() {
    return request("/api/transactions/summary");
}
