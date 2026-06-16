/**
 * @en Configuration options for automatic request retry logic.
 * @ru Конфигурационные опции для логики автоматического повторения запросов.
 */
export interface RetryOptions {
  /**
   * @en Maximum number of retry attempts.
   * @ru Максимальное количество повторных попыток.
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
