import type { Method, RequestBodyData, ResponseType } from "./http.js";
/**
 * @en Internal normalized representation of an HTTP request passing through the pipeline and runtime transport layers.
 * @ru Внутреннее нормализованное представление HTTP-запроса, проходящее через весь конвейер и рантайм-транспорты.
 */
export interface InternalRequest {
    /**
     * @en HTTP request method (GET, POST, PUT, etc.).
     * @ru HTTP-метод запроса (GET, POST, PUT и т.д.).
     */
    method: Method;
    /**
     * @en Full target URL address.
     * @ru Полный целевой URL-адрес.
     */
    url: string;
    /**
     * @en Dictionary of request headers.
     * @ru Словарь заголовков запроса.
     */
    headers: Record<string, string | string[]>;
    /**
     * @en Request body data (payload) sent to the server.
     * @ru Данные тела запроса (payload), отправляемые на сервер.
     */
    body?: RequestBodyData;
    /**
     * @en Abort signal to cancel the current network operation.
     * @ru Сигнал прерывания для отмены текущей сетевой операции.
     */
    signal?: AbortSignal;
    /**
     * @en Infrastructure metadata for metrics, caching, and logging plugins.
     * @ru Инфраструктурные метаданные для плагинов метрик, кэширования и логирования.
     */
    meta?: {
        timings?: {
            networkMs?: number;
        };
        responseType?: ResponseType;
    };
}
/**
 * @en Interface for objects supporting secure isolated copy operations.
 * @ru Интерфейс для объектов, поддерживающих безопасное изолированное копирование.
 * @template T - Target return object type.
 */
export interface Cloneable<T> {
    /**
     * @en Generates an independent clone of the current object.
     * @ru Создает независимую копию текущего объекта.
     */
    clone(): T;
}
/**
 * @en Unified typed response container wrapper of the Hyperttp client.
 * @ru Единый типизированный объект ответа клиента Hyperttp.
 * @template T - Type of the resolved response body structure.
 */
export interface HttpResponse<T = unknown> extends Cloneable<HttpResponse<T>> {
    /**
     * @en Numeric HTTP response status code (e.g., 200, 404).
     * @ru HTTP-статус код ответа сервера (например, 200, 404).
     */
    status: number;
    /**
     * @en Key-value map of response headers returned by the remote server.
     * @ru Заголовки ответа, возвращенные удаленным сервером.
     */
    headers: Record<string, string | string[]>;
    /**
     * @en Final resolved response URL destination (accounting for server redirects).
     * @ru Финальный URL-адрес ответа (после обработки возможных редиректов).
     */
    url?: string;
    /**
     * @en Parsed data structure or raw payload statement of the response body.
     * @ru Распарсенное или сырое тело ответа в зависимости от конфигурации.
     */
    body: T;
    /**
     * @en Spawns an isolated deep-copy response instance for thread-safe concurrent plugin operations.
     * @ru Создает глубокую изолированную копию ответа для безопасной параллельной обработки в плагинах.
     */
    clone(): HttpResponse<T>;
    /**
     * @en Native high-performance text stream parsing implementation.
     * @ru Нативная высокопроизводительная вычитка тела ответа в виде строки.
     */
    text: () => Promise<string>;
    /**
     * @en Native high-performance async JSON stream parsing powered by runtime engine core.
     * @ru Нативный парсинг тела ответа в JSON на уровне Си++ движка рантайма.
     */
    json: <T = unknown>() => Promise<T>;
    /**
     * @en Immediate stream drain helper to release and recycle the underlying socket.
     * @ru Сброс стрима в никуда для моментального освобождения сокета обратно в пул.
     */
    dump: () => Promise<void>;
}
/**
 * @en Realtime statistics, core runtime performance metrics, and orchestrator queue logs container.
 * @ru Объект метрик, внутренней статистики производительности ядра и логов состояния очередей.
 */
export interface HyperStats {
    /**
     * @en Current number of concurrent in-flight requests running.
     * @ru Текущее количество активных сетевых запросов в полете.
     */
    inflightRequests?: number;
    /**
     * @en Current size or absolute entry count stored within the cache layout layer.
     * @ru Текущий объем или количество записей в оперативной памяти кэша.
     */
    cacheSize?: number;
    /**
     * @en Number of tasks deferred, waiting inside the scheduler execution queue.
     * @ru Количество запросов, находящихся в очереди на отправку.
     */
    queuedRequests?: number;
    /**
     * @en Current operational weight or thread count of the active processing workers.
     * @ru Количество активных очередей или параллельных воркеров обработки.
     */
    activeQueue?: number;
    /**
     * @en Total count of rate limiter restriction breaches encountered.
     * @ru Суммарное количество срабатываний лимитера частоты запросов.
     */
    rateLimitHits?: number;
    /**
     * @en Arbitrary extension dynamic keys and variables applied by custom user modules.
     * @ru Любые динамические кастомные метрики, добавляемые плагинами пользователя.
     */
    [key: string]: unknown;
}
