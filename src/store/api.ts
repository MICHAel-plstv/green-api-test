import type { Credentials } from '@/helpers/schema';
import { REQUEST_TIMEOUT_MS, RATE_LIMIT_RETRY_MS } from '@/helpers/constants';

export class ApiError extends Error {
  status: number;
  constructor(status: number) {
    super(`GREEN-API responded with ${status}`);
    this.status = status;
  }
}

export const buildUrl = (
  { apiUrl, idInstance, apiTokenInstance }: Credentials,
  method: string,
) => {
  return `${apiUrl}/waInstance${idInstance}/${method}/${apiTokenInstance}`;
};

export const request = async <T>(
  url: string,
  init: RequestInit = {},
  retries = 1,
): Promise<T> => {
  // Сделано для поллинга
  // 30 секунд - потому что receiveTimeout=20 по докам
  const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);
  const signal = init.signal ? AbortSignal.any([init.signal, timeout]) : timeout;

  const response = await fetch(url, { ...init, signal });

  if (response.status === 429 && retries > 0) {
    await new Promise((resolve) => setTimeout(resolve, RATE_LIMIT_RETRY_MS));
    return request(url, init, retries - 1);
  }

  if (!response.ok) {
    throw new ApiError(response.status);
  }

  return JSON.parse((await response.text()) || 'null');
};
