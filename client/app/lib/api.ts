const API_URL =
    process.env.NEXT_PUBLIC_API_URL ?? process.env.API_URL ?? "http://127.0.0.1:8000/api";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

interface RequestOptions {
    method?: HttpMethod;
    token?: string | null;
    body?: unknown;
    signal?: AbortSignal;
}

interface ApiErrorPayload {
    message?: string;
    errors?: Record<string, string[]>;
}

export class ApiError extends Error {
    status: number;
    payload: ApiErrorPayload | null;

    constructor(status: number, message: string, payload: ApiErrorPayload | null) {
        super(message);
        this.status = status;
        this.payload = payload;
    }
}

async function request<TResponse>(
    path: string,
    { method = "GET", token, body, signal }: RequestOptions = {},
): Promise<TResponse> {
    const url = `${API_URL}${path.startsWith("/") ? path : `/${path}`}`;

    const headers: HeadersInit = {
        Accept: "application/json",
    };

    if (body !== undefined) {
        headers["Content-Type"] = "application/json";
    }

    if (token) {
        headers["Authorization"] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
        method,
        headers,
        body: body !== undefined ? JSON.stringify(body) : undefined,
        signal,
    });

    if (!response.ok) {
        let payload: ApiErrorPayload | null = null;

        try {
            payload = (await response.json()) as ApiErrorPayload;
        } catch {
            // ignore JSON parse errors
        }

        const message =
            payload?.message ||
            `API error ${response.status} (${response.statusText || "Unknown"})`;

        throw new ApiError(response.status, message, payload);
    }

    // 204 No Content
    if (response.status === 204) {
        return undefined as TResponse;
    }

    return (await response.json()) as TResponse;
}

export const api = {
    auth: {
        login: (email: string, password: string) =>
            request<{ token: string; user: unknown }>("/login", {
                method: "POST",
                body: { email, password },
            }),
        logout: (token: string | null) =>
            token
                ? request<{ status: string }>("/logout", {
                      method: "POST",
                      token,
                  })
                : Promise.resolve({ status: "ok" }),
    },
    graph: {
        get: () => request<import("@/app/graph/types").IGraphData>("/graph"),
    },
    meta: {
        getOptions: () =>
            request<{
                node_types: { label: string; value: string }[];
                edge_types: { label: string; value: string }[];
                genders: { label: string; value: string }[];
            }>("/meta/options"),
    },
    nodes: {
        create: (token: string, data: unknown) =>
            request("/admin/nodes", {
                method: "POST",
                token,
                body: data,
            }),
        update: (token: string, id: number, data: unknown) =>
            request(`/admin/nodes/${id}`, {
                method: "PUT",
                token,
                body: data,
            }),
        delete: (token: string, id: number) =>
            request<void>(`/admin/nodes/${id}`, {
                method: "DELETE",
                token,
            }),
        updatePosition: (token: string, id: number, position: { x: number; y: number }) =>
            request(`/admin/nodes/${id}/position`, {
                method: "PATCH",
                token,
                body: { position },
            }),
    },
    edges: {
        create: (token: string, data: unknown) =>
            request("/admin/edges", {
                method: "POST",
                token,
                body: data,
            }),
        delete: (token: string, id: number) =>
            request<void>(`/admin/edges/${id}`, {
                method: "DELETE",
                token,
            }),
    },
};
