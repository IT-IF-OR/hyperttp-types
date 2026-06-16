import type { ResponseHeaders } from "./response";

/**
 * @en Interface representing a raw streaming response.
 * Used for requests where the response body is returned as a ReadableStream
 * without automatic buffering.
 * @ru Интерфейс, представляющий сырой потоковый ответ.
 * Используется для запросов, где тело ответа возвращается как ReadableStream
 * без автоматической буферизации.
 * @template TBody - Type of the response body stream.
 */
export interface StreamResponse<TBody = ReadableStream> {
  /**
   * @en Numeric HTTP response status code.
   * @ru Числовой HTTP-код статуса ответа.
   */
  status: number;

  /**
   * @en Key-value map of response headers.
   * @ru Карта заголовков ответа ключ-значение.
   */
  headers: ResponseHeaders;

  /**
   * @en The raw body stream.
   * @ru Сырой поток тела ответа.
   */
  body: TBody;

  /**
   * @en The final URL of the response.
   * @ru Финальный URL ответа.
   */
  url: string;

  /**
   * @en Abort signal associated with the stream.
   * @ru Сигнал прерывания, связанный с потоком.
   */
  signal?: AbortSignal;

  /**
   * @en Total content length in bytes, if known (from the Content-Length header).
   * @ru Общая длина контента в байтах, если известна (из заголовка Content-Length).
   */
  contentLength?: number;

  /**
   * @en Character encoding of the response content (e.g., 'utf-8').
   * @ru Кодировка символов содержимого ответа (например, 'utf-8').
   */
  encoding?: string;
}
