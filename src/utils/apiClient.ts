/**
 * NagrikAI API Client
 * Robust client-side request handler with full content-type validation,
 * HTTP status inspection, HTML error protection, and environment variable support.
 */

// Allow custom backend URL via VITE_API_URL, default to relative for same-origin proxy
export const API_BASE_URL = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export interface ApiResponse<T = any> {
  success: boolean;
  status: number;
  data?: T;
  error?: string;
  message?: string;
}

/**
 * Execute a safe fetch request with explicit HTTP status and content-type checks.
 * Prevents "Unexpected token '<' / 'T' ... is not valid JSON" errors when servers
 * return HTML 404 or 500 error pages.
 */
export async function apiRequest<T = any>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  const url = cleanEndpoint.startsWith('http')
    ? cleanEndpoint
    : `${API_BASE_URL}${cleanEndpoint}`;

  const headers = new Headers(options.headers || {});
  if (!headers.has('Accept')) {
    headers.set('Accept', 'application/json');
  }
  if (!headers.has('Content-Type') && !(options.body instanceof FormData)) {
    headers.set('Content-Type', 'application/json');
  }

  let res: Response;
  try {
    res = await fetch(url, {
      ...options,
      headers,
    });
  } catch (networkError: any) {
    console.error(`[NagrikAI Network Error] Failed to reach ${url}:`, networkError);
    return {
      success: false,
      status: 0,
      error: 'Unable to connect to NagrikAI servers. Please check your internet connection or verify the server status.',
    };
  }

  const status = res.status;
  const contentType = (res.headers.get('content-type') || '').toLowerCase();
  const isJson = contentType.includes('application/json');

  // Case 1: Response is valid JSON
  if (isJson) {
    try {
      const data = await res.json();
      if (res.ok && data.success !== false) {
        return {
          success: true,
          status,
          data,
          message: data.message,
        };
      } else {
        const errorMessage =
          data.error ||
          data.message ||
          (status === 401
            ? 'Invalid credentials. Please verify your email and password.'
            : status === 409
            ? 'An account with this email already exists.'
            : status === 404
            ? 'The requested resource was not found.'
            : `Request failed with status ${status}`);
        return {
          success: false,
          status,
          data,
          error: errorMessage,
        };
      }
    } catch (parseError) {
      console.error(`[NagrikAI JSON Parse Error] Failed to parse JSON from ${url}:`, parseError);
      return {
        success: false,
        status,
        error: 'Received malformed data from the server. Please try again.',
      };
    }
  }

  // Case 2: Response is HTML or plain text (e.g. Vercel 404, nginx 502, Cloudflare error)
  let rawText = '';
  try {
    rawText = await res.text();
  } catch (textErr) {
    // Ignore text extraction error
  }

  console.warn(
    `[NagrikAI Non-JSON Response] ${url} returned HTTP ${status} (${contentType || 'no content-type'}):`,
    rawText.slice(0, 150)
  );

  // Friendly citizen error mapping
  if (status === 404) {
    return {
      success: false,
      status,
      error:
        'The authentication service endpoint could not be found (HTTP 404). If deployed on Vercel, ensure API routes or VITE_API_URL are configured.',
    };
  }

  if (status === 401 || status === 403) {
    return {
      success: false,
      status,
      error: 'Access denied. Please check your email and password.',
    };
  }

  if (status >= 500) {
    return {
      success: false,
      status,
      error: `The server encountered a temporary issue (HTTP ${status}). Please try again in a few moments.`,
    };
  }

  return {
    success: false,
    status,
    error: `Unable to process request (HTTP ${status}). Please try again.`,
  };
}

export const apiClient = {
  get: <T = any>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'GET', headers }),

  post: <T = any>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, {
      method: 'POST',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }),

  put: <T = any>(endpoint: string, body?: any, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, {
      method: 'PUT',
      headers,
      body: body ? JSON.stringify(body) : undefined,
    }),

  delete: <T = any>(endpoint: string, headers?: Record<string, string>) =>
    apiRequest<T>(endpoint, { method: 'DELETE', headers }),
};
