import type { HyperPlugin } from "./plugin.js";

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

/**
 * @en Detailed performance metrics and lifecycle data for a single HTTP request.
 * @ru Детальные метрики производительности и данные жизненного цикла для одного HTTP-запроса.
 */
export interface RequestMetrics {
  /**
   * @en Timestamp marking the initiation of the request process.
   * @ru Временная метка начала процесса запроса.
   */
  startTime: number;

  /**
   * @en Timestamp marking the completion of the request process.
   * @ru Временная метка завершения процесса запроса.
   */
  endTime: number;

  /**
   * @en Total elapsed time for the request in milliseconds.
   * @ru Общее затраченное время на запрос в миллисекундах.
   */
  duration: number;

  /**
   * @en HTTP status code returned by the server, if available.
   * @ru HTTP-код статуса, возвращенный сервером, если доступен.
   */
  statusCode?: number;

  /**
   * @en Total number of bytes received in the response body.
   * @ru Общее количество байт, полученных в теле ответа.
   */
  bytesReceived: number;

  /**
   * @en Total number of bytes sent in the request body.
   * @ru Общее количество байт, отправленных в теле запроса.
   */
  bytesSent: number;

  /**
   * @en Number of retry attempts performed for this request.
   * @ru Количество попыток повторения, выполненных для этого запроса.
   */
  retries: number;

  /**
   * @en Indicates whether the response was served from cache.
   * @ru Указывает, был ли ответ получен из кэша.
   */
  cached: boolean;

  /**
   * @en The target URL of the request.
   * @ru Целевой URL запроса.
   */
  url: string;

  /**
   * @en The HTTP method used for the request.
   * @ru HTTP-метод, использованный для запроса.
   */
  method: string;

  /**
   * @en Optional hash identifier of the request body for integrity or caching checks.
   * @ru Опциональный хеш-идентификатор тела запроса для проверки целостности или кэширования.
   */
  bodyHash?: string;

  /**
   * @en Map of plugins involved in processing this request.
   * @ru Карта плагинов, участвовавших в обработке этого запроса.
   */
  plugins?: Map<string, HyperPlugin>;

  /**
   * @en Breakdown of time spent in specific processing stages.
   * @ru Разбивка времени, затраченного на определенные этапы обработки.
   */
  stages?: {
    /**
     * @en Time spent serializing the request payload.
     * @ru Время, затраченное на сериализацию полезной нагрузки запроса.
     */
    serializationMs?: number;

    /**
     * @en Time spent on network transmission (DNS, TCP, TLS, TTFB).
     * @ru Время, затраченное на сетевую передачу (DNS, TCP, TLS, TTFB).
     */
    networkMs?: number;

    /**
     * @en Time spent parsing the response body.
     * @ru Время, затраченное на парсинг тела ответа.
     */
    parsingMs?: number;
  };
}
