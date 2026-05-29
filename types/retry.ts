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
   * @en Base delay between retries in milliseconds.
   * @ru Базовая задержка между попытками (мс).
   */
  baseDelay?: number;

  /**
   * @en Maximum delay cap between retries in milliseconds.
   * @ru Максимальная задержка между попытками (мс).
   */
  maxDelay?: number;

  /**
   * @en List of HTTP status codes that should trigger a retry.
   * @ru Коды HTTP, при которых выполняется retry.
   */
  retryStatusCodes?: readonly number[];

  /**
   * @en Enable random jitter to prevent thundering herd problem.
   * @ru Добавлять случайный jitter к задержке.
   */
  jitter?: boolean;
}
