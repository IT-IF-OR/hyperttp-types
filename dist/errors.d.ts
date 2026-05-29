export interface HyperttpError extends Error {
    /**
     * Унифицированный machine-readable код ошибки.
     * Рекомендуемые значения: 'TIMEOUT', 'ABORTED', 'HTTP_ERROR', 'NETWORK_ERROR', 'PARSE_ERROR'
     */
    code: string;
    /**
     * Исходная первопричина (если есть). Рантаймы уже поддерживают Error.cause нативно,
     * но явное указание типа повышает удобство при работе со старыми окружениями.
     */
    cause?: unknown;
    /**
     * Контекст запроса, при котором произошел сбой.
     */
    request: {
        url: string;
        method: string;
        headers: Record<string, string | string[]>;
    };
    /**
     * Контекст ответа (доступен, только если сервер успел ответить, например при non-2xx статусах).
     */
    response?: {
        status: number;
        statusText: string;
        headers: Record<string, string | string[]>;
        url: string;
    };
    /**
     * Алиасы для обратной совместимости со сторонними экосистемами (Axios, Fetch-вызовы)
     */
    status?: number;
    statusCode?: number;
    /**
     * Тайминги и метаданные жизненного цикла запроса
     */
    meta?: {
        retryCount: number;
        isRetryable: boolean;
        duration?: number;
        timings?: {
            start: number;
            end?: number;
        };
    };
}
