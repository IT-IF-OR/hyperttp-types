import type { Method } from "./http.js";
import type { RequestBodyData } from "./request.js";

/**
 * @ru Кастомные методы-хелперы, подмешиваемые транспортами в тело ответа.
 * @en Custom helper methods injected into the response body by transport layers.
 */
export interface TransportStreamExtensions {
  /**
   * @ru Вычитывает поток «в никуда» для корректного освобождения и возврата сокета в пул соединений.
   * @en Drains the stream completely to safely release and recycle the underlying network socket.
   */
  dump(): Promise<void>;
}

/**
 * @ru Допустимые типы сырого тела ответа: Web ReadableStream (Bun), Node.js Readable или null.
 * @en Allowed raw response body types: Web ReadableStream (Bun), Node.js Readable, or null.
 */
export type TransportResponsePayload =
  | ((ReadableStream<Uint8Array> | ReadableStream) & TransportStreamExtensions)
  | null;

/**
 * @ru Нормализованная структура запроса для уровня сетевого транспорта.
 * @en Normalized request structure for the network transport layer.
 */
export interface TransportRequest {
  method: Method;
  url: string;
  headers: Record<string, string | string[]>;
  body?: RequestBodyData;
  signal?: AbortSignal;
}

/**
 * @ru Сырой низкоуровневый ответ, возвращаемый сетевым транспортом.
 * @en Raw low-level response returned by the network transport layer.
 */
export interface TransportResponse {
  status: number;
  headers: Record<string, string | string[]>;
  body: TransportResponsePayload;
  url: string;
  // Добавляем описание методов
  text: () => Promise<string>;
  json: <T = unknown>() => Promise<T>;
}

/**
 * @ru Общий интерфейс для реализации сетевых транспортов.
 * @en Unified interface for building runtime-specific network transports.
 */
export interface HyperTransport {
  execute(req: TransportRequest): Promise<TransportResponse>;
  close?(): Promise<void>;
  destroy?(): Promise<void>;
}
