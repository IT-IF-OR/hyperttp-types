import type { RequestHeaders } from "./http.js";
/**
 * @en Custom error type for hyperttp HTTP client with request/response context.
 * @ru Кастомный тип ошибки для HTTP-клиента hyperttp с контекстом запроса и ответа.
 */
export interface HyperttpError extends Error {
    /**
     * @en Error code identifying the type of error (e.g., "TIMEOUT", "NETWORK_ERROR").
     * @ru Код ошибки, идентифицирующий тип ошибки (например, "TIMEOUT", "NETWORK_ERROR").
     */
    code: string;
    /**
     * @en The original cause of this error, if available.
     * @ru Оригинальная причина этой ошибки, если доступна.
     */
    cause?: unknown;
    /**
     * @en Request details that led to this error.
     * @ru Детали запроса, который привёл к этой ошибке.
     */
    request: {
        /**
         * @en Request URL.
         * @ru URL запроса.
         */
        url: string;
        /**
         * @en HTTP method (GET, POST, etc.).
         * @ru HTTP-метод (GET, POST и т.д.).
         */
        method: string;
        /**
         * @en Request headers sent with the request.
         * @ru Заголовки запроса, отправленные с запросом.
         */
        headers: RequestHeaders;
    };
    /**
     * @en Response details if a response was received before the error occurred.
     * @ru Детали ответа, если ответ был получен до возникновения ошибки.
     */
    response?: {
        /**
         * @en HTTP status code (e.g., 200, 404, 500).
         * @ru HTTP-статус код (например, 200, 404, 500).
         */
        status: number;
        /**
         * @en Status text associated with the status code.
         * @ru Текстовое описание статуса.
         */
        statusText: string;
        /**
         * @en Response headers.
         * @ru Заголовки ответа.
         */
        headers: RequestHeaders;
        /**
         * @en Final request URL (after redirects, if any).
         * @ru Итоговый URL запроса (после редиректов, если были).
         */
        url: string;
    };
    /**
     * @en HTTP status code (alias for response.status).
     * @ru HTTP-статус код (алиас для response.status).
     */
    status?: number;
    /**
     * @en HTTP status code (alias for status).
     * @ru HTTP-статус код (алиас для status).
     */
    statusCode?: number;
    /**
     * @en Additional metadata about the error and request lifecycle.
     * @ru Дополнительная метаданная об ошибке и жизненном цикле запроса.
     */
    meta?: {
        /**
         * @en Number of retry attempts made before this error.
         * @ru Количество попыток повторного запроса до этой ошибки.
         */
        retryCount: number;
        /**
         * @en Whether this error is retryable (can be retried).
         * @ru Можно ли повторить этот запрос (ошибка восстанавливаемая).
         */
        isRetryable: boolean;
        /**
         * @en Total request duration in milliseconds.
         * @ru Общая длительность запроса в миллисекундах.
         */
        duration?: number;
        /**
         * @en Timing information for the request lifecycle.
         * @ru Информация о таймингах жизненного цикла запроса.
         */
        timings?: {
            /**
             * @en Request start timestamp (Date.now()).
             * @ru Временная метка начала запроса (Date.now()).
             */
            start: number;
            /**
             * @en Request end timestamp (Date.now()), if available.
             * @ru Временная метка конца запроса (Date.now()), если доступна.
             */
            end?: number;
        };
    };
}
