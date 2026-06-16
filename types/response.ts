import type { RequestHeaders } from "./http.js";
import type { HyperBody } from "./transport.js";

/**
 * @en Interface for objects supporting secure isolated copy operations.
 * @ru Интерфейс для объектов, поддерживающих безопасное изолированное копирование.
 * @template T - Target return object type.
 */
export interface Cloneable<T> {
  /**
   * @en Generates an independent clone of the current object.
   * @ru Создаёт независимую копию текущего объекта.
   * @returns A deep isolated copy of the object.
   */
  clone(): T;
}

/**
 * @en Dictionary map of HTTP response headers.
 * @ru Словарь HTTP-заголовков ответа.
 */
export type ResponseHeaders = Record<string, string | string[]>;

/**
 * @en Unified typed response container wrapper.
 * Provides a unified API for reading the response body via text(), json(), dump() methods.
 * @ru Единый типизированный контейнер ответа.
 * Предоставляет унифицированный API для чтения тела ответа через методы text(), json(), dump().
 * @template T - Type of the resolved response body structure.
 */
export interface HttpResponse<T = unknown> extends Cloneable<HttpResponse<T>> {
  /**
   * @en Numeric HTTP response status code (e.g., 200, 404).
   * @ru Числовой HTTP-код статуса ответа (например, 200, 404).
   */
  status: number;

  /**
   * @en Key-value map of response headers.
   * @ru Карта заголовков ответа ключ-значение.
   */
  headers: RequestHeaders;

  /**
   * @en Final resolved URL of the response (after any redirects).
   * @ru Финальный разрешённый URL ответа (после возможных редиректов).
   */
  url?: string;

  /**
   * @en Parsed or raw response body data.
   * Can be the parsed type T, a HyperBody stream, Uint8Array buffer, or null.
   * @ru Распарсенные или сырые данные тела ответа.
   * Может быть распарсенным типом T, потоком HyperBody, буфером Uint8Array или null.
   */
  body: T | HyperBody | Uint8Array | null;

  /**
   * @en Creates a deep isolated copy of the response.
   * Uses tee() for streams to safely duplicate the flow.
   * @ru Создаёт глубокую изолированную копию ответа.
   * Для стримов использует tee() для безопасного раздвоения потока.
   * @returns A new HttpResponse instance with cloned data.
   */
  clone(): HttpResponse<T>;

  /**
   * @en Parses the response body as a text string.
   * Result is cached — subsequent calls return the same promise.
   * @ru Парсит тело ответа как текстовую строку.
   * Результат кэшируется — повторные вызовы возвращают тот же промис.
   * @returns A promise resolving to the response text.
   */
  text(): Promise<string>;

  /**
   * @en Parses the response body as JSON.
   * Result is cached — subsequent calls return the same object.
   * @ru Парсит тело ответа как JSON.
   * Результат кэшируется — повторные вызовы возвращают тот же объект.
   * @template R - Expected type of the parsed JSON.
   * @returns A promise resolving to the parsed JSON data.
   */
  json<R = unknown>(): Promise<R>;

  /**
   * @en Discards the response body to free up resources (socket).
   * Must be called if the response body won't be used,
   * allowing the transport to return the connection to the pool.
   * @ru Отбрасывает тело ответа для освобождения ресурсов (сокета).
   * Необходимо вызывать, если тело ответа не будет использоваться,
   * чтобы транспорт мог вернуть соединение в пул.
   * @returns A promise that resolves when the body is fully drained.
   */
  dump(): Promise<void>;
}

/**
 * @en Metadata context used during response conversion or parsing.
 * Passed to adapters and plugins to make decisions about processing format.
 * @ru Метаданные контекста, используемые при конвертации или парсинге ответа.
 * Передаётся в адаптеры и плагины для принятия решений о формате обработки.
 */
export interface ConversionMeta {
  /**
   * @en MIME type of the content (e.g., 'application/json').
   * @ru MIME-тип содержимого (например, 'application/json').
   */
  contentType?: string;

  /**
   * @en Content encoding (e.g., gzip, deflate, br).
   * @ru Кодирование содержимого (например, gzip, deflate, br).
   */
  contentEncoding?: string;

  /**
   * @en Source URL of the content.
   * @ru Исходный URL содержимого.
   */
  url?: string;
}
