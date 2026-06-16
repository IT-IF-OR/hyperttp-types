import type { Method, RequestBodyData } from "./http.js";
import type { StealthOptions } from "./stealth.js";

/**
 * @en Extensions injected into streaming body objects.
 * Guarantees the presence of the dump() method for proper resource cleanup.
 * @ru Расширения, добавляемые к стримам тела ответа.
 * Гарантирует наличие метода dump() для корректного освобождения ресурсов.
 */
export interface TransportStreamExtensions {
  /**
   * @en Forces stream drain to release the underlying socket.
   * Must be called if the response body won't be used,
   * allowing the transport to return the connection to the pool.
   * @ru Полностью вычитывает поток для освобождения сокета.
   * Необходимо вызывать, если тело ответа не будет использоваться,
   * чтобы транспорт мог вернуть соединение в пул.
   * @returns A promise that resolves when the stream is fully drained.
   */
  dump(): Promise<void>;
}

/**
 * @en Extended ReadableStream with convenience methods for reading body content.
 * Added via runtime patching through patchReadableStream() to unify the API
 * across all environments (Node.js, Bun, Deno, Browser).
 * @ru Расширенный ReadableStream с удобными методами для чтения содержимого тела.
 * Добавляется через runtime-патч patchReadableStream() для унификации API
 * во всех средах (Node.js, Bun, Deno, Browser).
 */
export interface HyperBody extends ReadableStream<Uint8Array> {
  /**
   * @en Reads the stream as text.
   * @ru Читает поток как текст.
   * @returns A promise resolving to the text content.
   */
  text(): Promise<string>;

  /**
   * @en Reads and parses the stream as JSON.
   * @ru Читает и парсит поток как JSON.
   * @template T - Expected type of the parsed JSON.
   * @returns A promise resolving to the parsed JSON data.
   */
  json<T = unknown>(): Promise<T>;

  /**
   * @en Reads the stream as an ArrayBuffer.
   * @ru Читает поток как ArrayBuffer.
   * @returns A promise resolving to the binary data.
   */
  arrayBuffer(): Promise<ArrayBuffer>;

  /**
   * @en Reads the stream as a Blob.
   * @ru Читает поток как Blob.
   * @returns A promise resolving to the Blob representation.
   */
  blob(): Promise<Blob>;

  /**
   * @en Reads the stream as a Uint8Array.
   * @ru Читает поток как Uint8Array.
   * @returns A promise resolving to the byte array.
   */
  bytes(): Promise<Uint8Array>;

  /**
   * @en Cancels the stream to release resources.
   * @ru Отменяет поток для освобождения ресурсов.
   * @returns A promise that resolves when the stream is cancelled.
   */
  dump(): Promise<void>;
}

/**
 * @en Raw response payload types supported by transports.
 * The transport returns one of these values, and the core (HyperCore) wraps it into an HttpResponse.
 * @ru Сырые типы тела ответа, поддерживаемые транспортами.
 * Транспорт возвращает одно из этих значений, а ядро (HyperCore) оборачивает его в HttpResponse.
 */
export type TransportResponsePayload =
  | HyperBody
  | (Uint8Array & TransportStreamExtensions)
  | null;

/**
 * @en Normalized request for the transport layer.
 * Created by the HyperCore and passed to the transport for execution.
 * @ru Нормализованный запрос для транспортного слоя.
 * Создаётся ядром HyperCore и передаётся в транспорт для выполнения.
 */
export interface TransportRequest {
  /**
   * @en HTTP request method (GET, POST, etc.).
   * @ru HTTP-метод запроса (GET, POST и т.д.).
   */
  method: Method;

  /**
   * @en Full request URL (scheme + host + path + query).
   * @ru Полный URL запроса (схема + хост + путь + query).
   */
  url: string;

  /**
   * @en Dictionary of request headers.
   * @ru Словарь заголовков запроса.
   */
  headers: Record<string, string | string[]>;

  /**
   * @en Request body data (if applicable for the method).
   * @ru Данные тела запроса (если применимо для метода).
   */
  body?: RequestBodyData;

  /**
   * @en Abort signal for cancelling the request.
   * @ru Сигнал прерывания для отмены запроса.
   */
  signal?: AbortSignal;

  /**
   * @en Request-specific network stealth and camouflage options.
   * Merged by core with global client configuration.
   * @ru Специфичные для запроса опции скрытности и маскировки.
   * Объединяются ядром с глобальной конфигурацией клиента.
   */
  stealth?: StealthOptions;
}

/**
 * @en Raw low-level response returned by transport implementations.
 *
 * ⚠️ IMPORTANT:
 * Transport MUST NOT implement:
 * - decompression (gzip/brotli)
 * - caching logic
 * - retries
 *
 * @ru Сырой низкоуровневый ответ, возвращаемый реализациями транспорта.
 *
 * ⚠️ ВАЖНО:
 * Транспорт НЕ ДОЛЖЕН реализовывать:
 * - парсинг тела (text/json/buffer)
 * - логику кэширования
 * - повторные попытки (retries)
 */
export interface TransportResponse {
  /**
   * @en Numeric HTTP response status code.
   * @ru Числовой HTTP-код статуса ответа.
   */
  status: number;

  /**
   * @en Dictionary of response headers.
   * @ru Словарь заголовков ответа.
   */
  headers: Record<string, string | string[]>;

  /**
   * @en Raw response body (stream, buffer, or null).
   * @ru Сырое тело ответа (стрим, буфер или null).
   */
  body: TransportResponsePayload;

  /**
   * @en Final URL of the response (after any redirects).
   * @ru Финальный URL ответа (после возможных редиректов).
   */
  url: string;
}

/**
 * @en Adapter responsible for decoding TransportResponse into usable formats.
 *
 * This is where:
 * - decoding (gzip/brotli/custom C decoder)
 * - parsing (json/xml/html)
 * - buffering logic
 * lives.
 *
 * @ru Адаптер, отвечающий за преобразование TransportResponse в удобные форматы.
 *
 * Здесь живёт:
 * - декодирование (gzip/brotli/кастомный C-декодер)
 * - парсинг (json/xml/html)
 * - логика буферизации
 */
export interface ResponseAdapter {
  /**
   * @en Extracts the response body as text.
   * @ru Извлекает тело ответа как текст.
   * @param res - The raw transport response.
   * @returns A promise resolving to the text content.
   */
  text(res: TransportResponse): Promise<string>;

  /**
   * @en Extracts and parses the response body as JSON.
   * @ru Извлекает и парсит тело ответа как JSON.
   * @template T - Expected type of the parsed JSON.
   * @param res - The raw transport response.
   * @returns A promise resolving to the parsed JSON data.
   */
  json<T = unknown>(res: TransportResponse): Promise<T>;

  /**
   * @en Extracts the response body as a binary buffer.
   * @ru Извлекает тело ответа как бинарный буфер.
   * @param res - The raw transport response.
   * @returns A promise resolving to the Buffer.
   */
  buffer(res: TransportResponse): Promise<Buffer>;

  /**
   * @en Drains the stream without reading body content.
   * Used to release the socket when the response body is not needed.
   * @ru Сбрасывает поток без чтения содержимого тела.
   * Используется для освобождения сокета, когда тело ответа не нужно.
   * @param res - The raw transport response.
   * @returns A promise that resolves when the stream is drained.
   */
  dump(res: TransportResponse): Promise<void>;
}

/**
 * @en Core transport interface for runtime implementations.
 *
 * Minimal contract by design:
 * Only responsibility = perform HTTP request.
 * All other logic (parsing, decompression, caching) lives in the core.
 *
 * @ru Базовый интерфейс транспорта для реализаций под разные рантаймы.
 *
 * Минимальный контракт по дизайну:
 * Единственная ответственность — выполнить HTTP-запрос.
 * Вся остальная логика (парсинг, декомпрессия, кэш) живёт в ядре.
 */
export interface HyperTransport {
  /**
   * @en Executes HTTP request and returns raw response.
   * @ru Выполняет HTTP-запрос и возвращает сырой ответ.
   * @param req - The normalized transport request.
   * @returns A promise resolving to the raw transport response.
   */
  execute(req: TransportRequest): Promise<TransportResponse>;

  /**
   * @en Gracefully closes transport and active connections.
   * Waits for current requests to complete before closing.
   * @ru Мягкое закрытие транспорта и активных соединений.
   * Ждёт завершения текущих запросов перед закрытием.
   * @returns A promise that resolves when the transport is closed.
   */
  close?(): Promise<void>;

  /**
   * @en Immediately destroys transport and sockets.
   * Abruptly terminates all active connections.
   * @ru Принудительное уничтожение транспорта и сокетов.
   * Немедленно обрывает все активные соединения.
   * @returns A promise that resolves when the transport is destroyed.
   */
  destroy?(): Promise<void>;
}
