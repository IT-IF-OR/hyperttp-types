import type { Method, RequestBodyData } from "./http.js";

/**
 * @en Extensions injected into streaming body objects.
 * @ru Расширения, добавляемые к стримам тела ответа.
 */
export interface TransportStreamExtensions {
  /**
   * @en Forces stream drain to release underlying socket.
   * @ru Полностью вычитывает поток для освобождения сокета.
   */
  dump(): Promise<void>;
}

/**
 * @en Raw response payload supported by transports.
 * @ru Сырые типы тела ответа, поддерживаемые транспортами.
 */
export type TransportResponsePayload =
  | (ReadableStream<Uint8Array> & TransportStreamExtensions)
  | (Uint8Array & TransportStreamExtensions)
  | null;

/**
 * @en Normalized request for transport layer.
 * @ru Нормализованный запрос для транспортного слоя.
 */
export interface TransportRequest {
  method: Method;
  url: string;
  headers: Record<string, string | string[]>;
  body?: RequestBodyData;
  signal?: AbortSignal;
}

/**
 * @en Raw low-level response returned by transport implementations.
 * @ru Сырой низкоуровневый ответ транспорта.
 *
 * ⚠️ IMPORTANT:
 * Transport MUST NOT implement:
 * - text/json/buffer parsing
 * - decompression
 * - caching logic
 * - retries
 */
export interface TransportResponse {
  status: number;
  headers: Record<string, string | string[]>;
  body: TransportResponsePayload;
  url: string;
}

/**
 * @en Adapter responsible for decoding TransportResponse into usable formats.
 * @ru Адаптер, отвечающий за преобразование TransportResponse в удобные форматы.
 *
 * 💡 This is where:
 * - decoding (gzip/brotli/custom C decoder)
 * - parsing (json/xml/html)
 * - buffering logic
 * lives.
 */
export interface ResponseAdapter {
  text(res: TransportResponse): Promise<string>;
  json<T = unknown>(res: TransportResponse): Promise<T>;
  buffer(res: TransportResponse): Promise<Buffer>;

  /**
   * @en Drain stream without reading body content.
   * @ru Сброс потока без чтения тела.
   */
  dump(res: TransportResponse): Promise<void>;
}

/**
 * @en Core transport interface for runtime implementations.
 * @ru Базовый интерфейс транспорта для разных рантаймов.
 *
 * 🔥 Minimal contract by design:
 * Only responsibility = perform HTTP request.
 */
export interface HyperTransport {
  /**
   * @en Executes HTTP request and returns raw response.
   * @ru Выполняет HTTP запрос и возвращает сырой ответ.
   */
  execute(req: TransportRequest): Promise<TransportResponse>;

  /**
   * @en Gracefully closes transport and active connections.
   * @ru Мягкое закрытие транспорта.
   */
  close?(): Promise<void>;

  /**
   * @en Immediately destroys transport and sockets.
   * @ru Принудительное уничтожение транспорта.
   */
  destroy?(): Promise<void>;
}
