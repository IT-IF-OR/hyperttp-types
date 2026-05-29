import type { ReadableStream } from "node:stream/web";

/**
 * @en Interface representing a raw streaming response.
 * @ru Интерфейс, представляющий сырой потоковый ответ.
 * @template TBody - Type of the response body stream.
 */
export interface StreamResponse<TBody = ReadableStream> {
  /**
   * @en HTTP status code.
   * @ru HTTP статус код ответа.
   */
  status: number;

  /**
   * @en Response headers (raw).
   * @ru Заголовки ответа (сырые).
   */
  headers: Record<string, string | string[] | undefined>;

  /**
   * @en Streamed body (low-level chunks).
   * @ru Потоковое тело (низкоуровневые чанки).
   */
  body: TBody;

  /**
   * @en Final resolved URL (after redirects).
   * @ru Финальный URL (после редиректов).
   */
  url: string;

  /**
   * @en Optional signal for abort tracking (useful for pipeline control).
   * @ru Сигнал для отслеживания abort (pipeline control).
   */
  signal?: AbortSignal;

  /**
   * @en Content-Length if known (zero-copy optimizations).
   * @ru Content-Length если известен (zero-copy оптимизации).
   */
  contentLength?: number;

  /**
   * @en Encoding hint (gzip/br/etc).
   * @ru Hint кодировки (gzip/br/etc).
   */
  encoding?: string;
}
