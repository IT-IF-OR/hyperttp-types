import type { RequestHeaders } from "./http.js";
import type { StealthOptions } from "./stealth.js";

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

  /**
   * @en Core settings for traffic camouflage and deep packet inspection (DPI) bypass.
   * @ru Настройки маскировки трафика и обхода систем глубокого анализа пакетов (DPI).
   */
  stealth?: StealthOptions;
}
