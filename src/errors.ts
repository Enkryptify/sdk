export class EnkryptifyError extends Error {
    constructor(message: string) {
        super(message);
        this.name = "EnkryptifyError";
    }
}

export class SecretNotFoundError extends EnkryptifyError {
    constructor(key: string, workspace: string, environment: string) {
        super(
            `Secret "${key}" not found in workspace "${workspace}" (environment: "${environment}"). ` +
                `Verify the secret exists in your Enkryptify dashboard.\n` +
                `Docs: https://docs.enkryptify.com/sdk/troubleshooting#secret-not-found`,
        );
        this.name = "SecretNotFoundError";
    }
}

export class AuthenticationError extends EnkryptifyError {
    constructor(status: number) {
        super(
            `Authentication failed (HTTP ${status}). Your token may be expired or invalid. ` +
                `Generate a new token in your Enkryptify dashboard.\n` +
                `Docs: https://docs.enkryptify.com/sdk/auth#token-issues`,
        );
        this.name = "AuthenticationError";
    }
}

export class ApiError extends EnkryptifyError {
    public readonly status: number;

    constructor(status: number, statusText: string, method: string, endpoint: string) {
        super(
            `API request failed (HTTP ${status}) for ${method} ${endpoint}. ` +
                `${statusText ? statusText + ". " : ""}` +
                `This may be a temporary server issue — retry in a few moments.\n` +
                `Docs: https://docs.enkryptify.com/sdk/troubleshooting#api-errors`,
        );
        this.name = "ApiError";
        this.status = status;
    }
}
