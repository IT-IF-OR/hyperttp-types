import type { HyperPlugin } from "./plugins.js";

/**
 * @ru Метрики и аналитические показатели производительности выполнения конкретного HTTP-запроса.
 * @en Analytical metrics and performance benchmarks collected during a specific HTTP request execution.
 */
export interface RequestMetrics {
  /**
   * @ru Временная метка начала выполнения запроса (Unix timestamp в миллисекундах).
   * @en Request execution start timestamp in milliseconds.
   */
  startTime: number;

  /**
   * @ru Временная метка завершения выполнения запроса (Unix timestamp в миллисекундах).
   * @en Request execution completion timestamp in milliseconds.
   */
  endTime: number;

  /**
   * @ru Суммарная длительность выполнения полного цикла запроса в миллисекундах.
   * @en Total execution duration of the request loop in milliseconds.
   */
  duration: number;

  /**
   * @ru Полученный HTTP-статус код ответа сервера (если ответ был успешно доставлен).
   * @en Resolved HTTP response status code (if available).
   */
  statusCode?: number;

  /**
   * @ru Количество байт, полученных от удаленного сервера (размер тела ответа и метаданных).
   * @en Total count of bytes downloaded from the remote server.
   */
  bytesReceived: number;

  /**
   * @ru Количество байт, отправленных на удаленный сервер (размер тела запроса и заголовков).
   * @en Total count of bytes uploaded to the remote server.
   */
  bytesSent: number;

  /**
   * @ru Количество выполненных повторных попыток отправки при сбоях.
   * @en Number of request transmission retries performed.
   */
  retries: number;

  /**
   * @ru Флаг, указывающий, был ли ответ отдан из локального кэша без похода в сеть.
   * @en Indicator showing if the response payload was served directly from the cache.
   */
  cached: boolean;

  /**
   * @ru Целевой URL-адрес, на который был отправлен запрос.
   * @en Targeted destination URL address string.
   */
  url: string;

  /**
   * @ru HTTP-метод, использованный при выполнении данной операции.
   * @en HTTP method verb utilized for this execution.
   */
  method: string;

  /**
   * @ru Хэш-сумма тела запроса, используемая механизмами кэширования и дедупликации.
   * @en Calculated request payload body hash string utilized for cache matching.
   */
  bodyHash?: string;

  /**
   * @ru Карта плагинов, которые были задействованы в конвейере обработки этого запроса.
   * @en Map container of plugins engaged during this specific request lifecycle.
   */
  plugins?: Map<string, HyperPlugin>;

  /**
   * @ru Детализированные тайминги прохождения изолированных внутренних фаз обработки.
   * @en Detailed duration benchmarks across isolated processing pipeline stages.
   */
  stages?: {
    /**
     * @ru Время, затраченное на сериализацию и подготовку тела запроса в миллисекундах.
     * @en Duration of the request body payload serialization phase in milliseconds.
     */
    serializationMs?: number;
    /**
     * @ru Чистое время выполнения сетевого ввода-вывода (I/O) на уровне транспорта.
     * @en Pure network I/O execution duration in milliseconds.
     */
    networkMs?: number;
    /**
     * @ru Время, затраченное на парсинг, декомпрессию и десериализацию ответа в миллисекундах.
     * @en Duration of the incoming response parsing and structure mapping phase in milliseconds.
     */
    parsingMs?: number;
  };
}
