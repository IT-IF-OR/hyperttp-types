export interface NetworkOptions {
    /**
     * @ru Таймаут запроса (мс)
     * @en Request timeout in milliseconds
     */
    timeout?: number;
    /**
     * @ru Максимум одновременных запросов. 0 = без лимита
     * @en Maximum concurrent requests. 0 = unlimited
     */
    maxConcurrent?: number;
    /**
     * @ru Количество pipelined запросов на соединение (для HTTP/1.1 фоллбэка)
     * @en Number of pipelined requests per connection (for HTTP/1.1 fallback)
     */
    pipelining?: number;
    /**
     * @ru Таймаут keep-alive соединения (мс)
     * @en Keep-alive connection timeout in milliseconds
     */
    keepAliveTimeout?: number;
    /**
     * @ru Отклонять недоверенные SSL сертификаты
     * @en Reject unauthorized SSL certificates
     */
    rejectUnauthorized?: boolean;
    /**
     * @ru Следовать за редиректами
     * @en Follow HTTP redirects
     */
    followRedirects?: boolean;
    /**
     * @ru Максимум редиректов
     * @en Maximum number of redirects to follow
     */
    maxRedirects?: number;
    /**
     * @ru Максимальный размер ответа (байты)
     * @en Maximum response body size in bytes
     */
    maxResponseBytes?: number;
    /**
     * @ru User-Agent заголовок
     * @en User-Agent header string
     */
    userAgent?: string;
    /**
     * @ru Базовые заголовки по умолчанию для всех запросов
     * @en Default base headers sent with every request
     */
    headers?: Record<string, string | string[]>;
    /**
     * @ru Функция валидации HTTP статуса
     * @en Function to validate HTTP status code
     * @param status - HTTP status code
     * @returns `true` if status is valid
     */
    validateStatus?: (status: number) => boolean;
}
