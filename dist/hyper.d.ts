import type { Method, ResponseType } from "./http.js";
import type { RequestBodyData } from "./request.js";
/**
 * @ru Внутреннее нормализованное представление HTTP-запроса, проходящее через весь конвейер и рантайм-транспорты.
 * @en Internal normalized representation of an HTTP request passing through the pipeline and runtime transport layers.
 */
export interface InternalRequest {
    /**
     * @ru HTTP-метод запроса (GET, POST, PUT и т.д.).
     * @en HTTP method verb of the request (GET, POST, PUT, etc.).
     */
    method: Method;
    /**
     * @ru Полный целевой URL-адрес.
     * @en Full target URL address string.
     */
    url: string;
    /**
     * @ru Словарь заголовков запроса.
     * @en Request headers dictionary map.
     */
    headers: Record<string, string | string[]>;
    /**
     * @ru Данные тела запроса (payload).
     * @en Optional request body payload data.
     */
    body?: RequestBodyData;
    /**
     * @ru Сигнал прерывания для отмены текущей сетевой операции.
     * @en Abort signal to cancel the ongoing network operation.
     */
    signal?: AbortSignal;
    /**
     * @ru Инфраструктурные метаданные для плагинов метрик, кэширования и логирования.
     * @en Infrastructure metadata container for metrics, caching, and logging plugins.
     */
    meta?: {
        /**
         * @ru Тайминги низкоуровневых этапов обработки.
         * @en Low-level request stage timing benchmarks.
         */
        timings?: {
            /**
             * @ru Чистое время выполнения сетевого запроса в миллисекундах.
             * @en Raw network execution duration in milliseconds.
             */
            networkMs?: number;
        };
        /**
         * @ru Ожидаемый тип формата ответа.
         * @en Expected format type of the incoming response payload.
         */
        responseType?: ResponseType;
    };
}
/**
 * @ru Интерфейс для объектов, поддерживающих безопасное изолированное копирование.
 * @en Interface for objects supporting secure isolated copy operations.
 * @template T - Target return object type.
 */
export interface Cloneable<T> {
    /**
     * @ru Создает независимую копию текущего объекта.
     * @en Generates an independent clone of the current object.
     */
    clone(): T;
}
/**
 * @ru Единый типизированный объект ответа клиента Hyperttp.
 * @en Unified typed response container wrapper of the Hyperttp client.
 * @template T - Type of the resolved response body structure.
 */
export interface HttpResponse<T = any> extends Cloneable<HttpResponse<T>> {
    /**
     * @ru HTTP-статус код ответа сервера (например, 200, 404).
     * @en Numeric HTTP response status code (e.g., 200, 404).
     */
    status: number;
    /**
     * @ru Заголовки ответа, возвращенные удаленным сервером.
     * @en Key-value map of response headers returned by the remote server.
     */
    headers: Record<string, any>;
    /**
     * @ru Финальный URL-адрес ответа (после обработки возможных редиректов).
     * @en Final resolved response URL destination (accounting for server redirects).
     */
    url?: string;
    /**
     * @ru Распарсенное или сырое тело ответа в зависимости от конфигурации.
     * @en Parsed data structure or raw payload statement of the response body.
     */
    body: T;
    /**
     * @ru Создает глубокую изолированную копию ответа для безопасной параллельной обработки в плагинах.
     * @en Spawns an isolated deep-copy response instance for thread-safe concurrent plugin operations.
     */
    clone(): HttpResponse<T>;
}
/**
 * @ru Объект метрик, внутренней статистики производительности ядра и логов состояния очередей.
 * @en Realtime statistics, core runtime performance metrics, and orchestrator queue logs container.
 */
export interface HyperStats {
    /**
     * @ru Текущее количество активных сетевых запросов в полете.
     * @en Current number of concurrent in-flight requests running.
     */
    inflightRequests?: number;
    /**
     * @ru Текущий объем или количество записей в оперативной памяти кэша.
     * @en Current size or absolute entry count stored within the cache layout layer.
     */
    cacheSize?: number;
    /**
     * @ru Количество запросов, находящихся в очереди на отправку.
     * @en Number of tasks deferred, waiting inside the scheduler execution queue.
     */
    queuedRequests?: number;
    /**
     * @ru Количество активных очередей или параллельных воркеров обработки.
     * @en Current operational weight or thread count of the active processing workers.
     */
    activeQueue?: number;
    /**
     * @ru Суммарное количество срабатываний лимитера частоты запросов.
     * @en Total count of rate limiter restriction breaches encountered.
     */
    rateLimitHits?: number;
    /**
     * @ru Любые динамические кастомные метрики, добавляемые плагинами пользователя.
     * @en Arbitrary extension dynamic keys and variables applied by custom user modules.
     */
    [key: string]: any;
}
