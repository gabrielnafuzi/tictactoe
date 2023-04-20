type CreateHttpClientOptions = {
  baseURL?: string
  headers?: Headers
}

type Options = Omit<RequestInit, 'body' | 'method'>

const createHttpClient = (options: CreateHttpClientOptions = {}) => {
  const {
    baseURL = globalThis.window?.location.origin,
    headers: defaultHeaders = new Headers(),
  } = options

  const buildUrl = (url: string, params: Record<string, string> = {}) => {
    const queryString = new URLSearchParams(params).toString()

    const urlWithParams = queryString ? `${url}?${queryString}` : url

    return new URL(urlWithParams, baseURL).toString()
  }

  const request = async <T = unknown, D = unknown>(
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH',
    url: string,
    data?: D | undefined,
    requestOptions: Options & { params?: Record<string, string> } = {}
  ) => {
    const headers = new Headers(defaultHeaders)
    headers.set('Content-Type', 'application/json')

    if (options.headers) {
      for (const [key, value] of options.headers.entries()) {
        headers.set(key, value)
      }
    }

    const response = await fetch(buildUrl(url, requestOptions.params), {
      ...requestOptions,
      method: method.toUpperCase(),
      body: data ? JSON.stringify(data) : null,
      headers,
    })

    if (!response.ok) {
      const json = (await response.json()) as T

      return Promise.reject({
        status: response.statusText,
        ok: false,
        body: json,
      })
    }

    return response.json() as T
  }

  return {
    get: <T = unknown>(
      url: string,
      options?: Options & { params?: Record<string, string> }
    ) => request<T>('GET', url, undefined, options),

    post: <T = unknown, D = unknown>(
      url: string,
      data?: D | undefined,
      options?: Options
    ) => request<T, D>('POST', url, data, options),

    put: <T = unknown, D = unknown>(
      url: string,
      data?: D | undefined,
      options?: Options
    ) => request<T, D>('PUT', url, data, options),

    patch: <T = unknown, D = unknown>(
      url: string,
      data?: D | undefined,
      options?: Options
    ) => request<T, D>('PATCH', url, data, options),

    delete: <T = unknown>(url: string, options?: Options) =>
      request<T>('DELETE', url, undefined, options),
  }
}

export const httpClient = createHttpClient()
