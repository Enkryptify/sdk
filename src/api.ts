import type { EnkryptifyAuthProvider, Secret } from "@/types";
import { AuthenticationError, ApiError } from "@/errors";
import { retrieveToken } from "@/internal/token-store";

export class EnkryptifyApi {
    #baseUrl: string;
    #auth: EnkryptifyAuthProvider;

    constructor(baseUrl: string, auth: EnkryptifyAuthProvider) {
        this.#baseUrl = baseUrl;
        this.#auth = auth;
    }

    async fetchSecret(workspace: string, project: string, secretName: string, environmentId: string): Promise<Secret> {
        const path = `/v1/workspace/${encodeURIComponent(workspace)}/project/${encodeURIComponent(project)}/secret/${encodeURIComponent(secretName)}`;
        const params = new URLSearchParams({ environmentId, resolve: "true" });
        return this.#request("GET", `${path}?${params.toString()}`);
    }

    async fetchAllSecrets(workspace: string, project: string, environmentId: string): Promise<Secret[]> {
        const path = `/v1/workspace/${encodeURIComponent(workspace)}/project/${encodeURIComponent(project)}/secret`;
        const params = new URLSearchParams({ environmentId, resolve: "true" });
        return this.#request("GET", `${path}?${params.toString()}`);
    }

    async #request<T>(method: string, endpoint: string): Promise<T> {
        const token = retrieveToken(this.#auth);
        const url = `${this.#baseUrl}${endpoint}`;

        const response = await fetch(url, {
            method,
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        });

        if (response.status === 401 || response.status === 403) {
            throw new AuthenticationError(response.status);
        }

        if (!response.ok) {
            throw new ApiError(response.status, response.statusText, method, endpoint);
        }

        return response.json() as Promise<T>;
    }
}
