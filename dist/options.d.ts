import type { LogLevel, RequestHeaders } from "./http.js";
import type { HyperPlugin } from "./plugin.js";
import type { HyperTransport } from "./transport.js";
/**
 * @en Configuration options for network behavior and connection management.
 * @ru Конфигурационные опции для сетевого поведения и управления соединениями.
 */
export interface NetworkOptions {
    /**
     * @en Request timeout in milliseconds.
     * @ru Таймаут запроса (мс).
     */
    timeout?: number;
    /**
     * @en Maximum concurrent requests. 0 = unlimited.
     * @ru Максимум одновременных запросов. 0 = без лимита.
     */
    maxConcurrent?: number;
    /**
     * @en Number of pipelined requests per connection (for HTTP/1.1 fallback).
     * @ru Количество pipelined запросов на соединение (для HTTP/1.1 фоллбэка).
     */
    pipelining?: number;
    /**
     * @en Keep-alive connection timeout in milliseconds.
     * @ru Таймаут keep-alive соединения (мс).
     */
    keepAliveTimeout?: number;
    /**
     * @en Reject unauthorized SSL certificates.
     * @ru Отклонять недоверенные SSL сертификаты.
     */
    rejectUnauthorized?: boolean;
    /**
     * @en Follow HTTP redirects.
     * @ru Следовать за редиректами.
     */
    followRedirects?: boolean;
    /**
     * @en Maximum number of redirects to follow.
     * @ru Максимум редиректов.
     */
    maxRedirects?: number;
    /**
     * @en Maximum response body size in bytes.
     * @ru Максимальный размер ответа (байты).
     */
    maxResponseBytes?: number;
    /**
     * @en User-Agent header string.
     * @ru User-Agent заголовок.
     */
    userAgent?: string;
    /**
     * @en Default base headers sent with every request.
     * @ru Базовые заголовки по умолчанию для всех запросов.
     */
    headers?: RequestHeaders;
    /**
     * @en Function to validate HTTP status code.
     * @ru Функция валидации HTTP статуса.
     * @param status - HTTP status code.
     * @returns `true` if status is valid.
     */
    validateStatus?: (status: number) => boolean;
}
/**
 * @en Configuration options for automatic request retry logic.
 * @ru Конфигурационные опции для логики автоматического повторения запросов.
 */
export interface RetryOptions {
    /**
     * @en Maximum number of retry attempts.
     * @ru Максимальное количество попыток повторения.
     */
    maxRetries?: number;
    /**
     * @en Initial delay between retries in milliseconds.
     * @ru Начальная задержка между попытками в миллисекундах.
     */
    baseDelay?: number;
    /**
     * @en Maximum delay cap between retries in milliseconds.
     * @ru Максимальная задержка между попытками в миллисекундах.
     */
    maxDelay?: number;
    /**
     * @en List of HTTP status codes that should trigger a retry.
     * @ru Список HTTP-кодов статуса, которые должны вызывать повторную попытку.
     */
    retryStatusCodes?: readonly number[];
    /**
     * @en Enable random jitter to prevent thundering herd problem.
     * @ru Включить случайный джиттер для предотвращения проблемы "громового стада".
     */
    jitter?: boolean;
}
/**
 * @en Branding interface for Hyperttp plugin extensions.
 * @ru Интерфейс брендинга для расширений плагинов Hyperttp.
 */
export interface HyperttpPluginsExtension {
    /**
     * @en Internal brand marker.
     * @ru Внутренний маркер бренда.
     */
    readonly _hyperttpBrand?: never;
}
/**
 * @en Base configuration options for the HTTP client instance.
 * @ru Базовые конфигурационные опции для экземпляра HTTP-клиента.
 */
export interface BaseHttpClientOptions {
    /**
     * @en Network layer configuration overrides.
     * @ru Переопределения конфигурации сетевого уровня.
     */
    network?: Partial<NetworkOptions>;
    /**
     * @en Retry logic configuration overrides.
     * @ru Переопределения конфигурации логики повторных попыток.
     */
    retry?: Partial<RetryOptions>;
    /**
     * @en Custom low-level network transport implementation.
     * @ru Кастомный низкоуровневый транспорт (например, для тестов или специфичного рантайма).
     */
    customTransport?: HyperTransport;
    /**
     * @en Custom logger function for internal events.
     * @ru Пользовательская функция логирования для внутренних событий.
     * @param level - Log severity level.
     * @param message - Log message content.
     * @param meta - Optional additional metadata context.
     */
    logger?: (level: LogLevel, message: string, meta?: unknown) => void;
    /**
     * @en Enable verbose logging output.
     * @ru Включить подробный вывод логов.
     */
    verbose?: boolean;
    /**
     * @en Directories to scan for loading external plugins.
     * @ru Директории для сканирования и загрузки внешних плагинов.
     */
    pluginDirs?: string[];
    /**
     * @en List of plugin instances or module paths to register.
     * @ru Список экземпляров плагинов или путей к модулям для регистрации.
     */
    plugins?: (HyperPlugin | string)[];
    /**
     * @en Enable collection of performance metrics.
     * @ru Включить сбор метрик производительности.
     */
    trackMetrics?: boolean;
}
/**
 * @en Full configuration options for the Hyperttp client, including plugin extensions.
 * @ru Полные конфигурационные опции для клиента Hyperttp, включая расширения плагинов.
 */
export interface HttpClientOptions extends BaseHttpClientOptions, HyperttpPluginsExtension {
}
