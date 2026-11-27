import type { ApiErrorBody } from '@/types/auth';

const HTTP_NO_CONTENT = 204;
const HTTP_UNAUTHORIZED = 401;
const HTTP_FORBIDDEN = 403;

export const PASSWORD_CHANGE_REQUIRED_MESSAGE = 'Change your password first.';

export class ApiError extends Error {
  status: number;
  body: ApiErrorBody | null;

  constructor(status: number, body: ApiErrorBody | null) {
    super(body?.message ?? `HTTP ${status}`);
    this.status = status;
    this.body = body;
  }
}

export type SessionHandlers = { onUnauthorized: () => void; onPasswordChangeRequired: () => void };

let authToken: string | null = null;
let sessionHandlers: SessionHandlers | null = null;

export function setAuthToken(token: string | null): void {
  authToken = token;
}

export function configureSessionHandlers(handlers: SessionHandlers): void {
  sessionHandlers = handlers;
}

function buildHeaders(hasBody: boolean): Record<string, string> {
  const headers: Record<string, string> = { Accept: 'application/json' };
  if (hasBody) headers['Content-Type'] = 'application/json';
  if (authToken !== null) headers.Authorization = `Bearer ${authToken}`;
  return headers;
}

async function throwResponseError(response: Response): Promise<never> {
  const body: ApiErrorBody | null = await response.json().catch(() => null);
  if (response.status === HTTP_UNAUTHORIZED && authToken !== null) {
    sessionHandlers?.onUnauthorized();
  }
  if (response.status === HTTP_FORBIDDEN && body?.message === PASSWORD_CHANGE_REQUIRED_MESSAGE) {
    sessionHandlers?.onPasswordChangeRequired();
  }
  throw new ApiError(response.status, body);
}

export async function requestJson<T>(path: string, init: RequestInit): Promise<T> {
  const apiUrl = process.env.EXPO_PUBLIC_API_URL;
  if (!apiUrl) throw new Error('EXPO_PUBLIC_API_URL is not set');

  const baseUrl = apiUrl.replace(/\/+$/, '');
  const response = await fetch(baseUrl + path, {
    ...init,
    headers: buildHeaders(init.body !== undefined && init.body !== null),
  });
  if (response.status === HTTP_NO_CONTENT) return undefined as T;
  if (response.ok) return (await response.json()) as T;
  return throwResponseError(response);
}

export function readErrorMessage(error: unknown, fallback: string): string {
  if (!(error instanceof ApiError)) return fallback;
  const firstFieldErrors = Object.values(error.body?.errors ?? {})[0];
  return firstFieldErrors?.[0] ?? error.body?.message ?? fallback;
}
