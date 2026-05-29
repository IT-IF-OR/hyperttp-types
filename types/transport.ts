import type { Method, RequestBodyData } from "./http.js";

/**
 * @en Custom helper methods injected into the response body by transport layers.
 * @ru Кастомные методы-хелперы, подмешиваемые транспортами в тело ответа.
 */
export interface TransportStreamExtensions {
  /**
   * @en Drains the stream completely to safely release and recycle the underlying network socket.
   * @ru Вычитывает поток «в никуда» для корректного освобождения и возврата сокета в пул соединений.
   */
  dump(): Promise<void>;
}

/**
 * @en Allowed raw response body types: Web ReadableStream (Bun), Node.js Readable, or null.
 * @ru Допустимые типы сырого тела ответа: Web ReadableStream (Bun), Node.js Readable или null.
 */
export type TransportResponsePayload =
  | ((ReadableStream<Uint8Array> | ReadableStream) & TransportStreamExtensions)
  | null;

/**
 * @en Normalized request structure for the network transport layer.
 * @ru Нормализованная структура запроса для уровня сетевого транспорта.
 */
export interface TransportRequest {
  /**
   * @en HTTP method used for the request.
   * @ru HTTP-метод, использованный для запроса.
   */
  method: Method;

  /**
   * @en Full target URL string.
   * @ru Полная строка целевого URL.
   */
  url: string;

  /**
   * @en Dictionary of request headers.
   * @ru Словарь заголовков запроса.
   */
  headers: Record<string, string | string[]>;

  /**
   * @en Request body payload data.
   * @ru Данные полезной нагрузки тела запроса.
   */
  body?: RequestBodyData;

  /**
   * @en Abort signal for cancelling the request.
   * @ru Сигнал прерывания для отмены запроса.
   */
  signal?: AbortSignal;
}

/**
 * @en Raw low-level response returned by the network transport layer.
 * @ru Сырой низкоуровневый ответ, возвращаемый сетевым транспортом.
 */
export interface TransportResponse {
  /**
   * @en Numeric HTTP response status code.
   * @ru Числовой HTTP-код статуса ответа.
   */
  status: number;

  /**
   * @en Key-value map of response headers.
   * @ru Карта заголовков ответа ключ-значение.
   */
  headers: Record<string, string | string[]>;

  /**
   * @en The raw response body payload.
   * @ru Сырая полезная нагрузка тела ответа.
   */
  body: TransportResponsePayload;

  /**
   * @en The final resolved URL of the response.
   * @ru Финальный разрешенный URL ответа.
   */
  url: string;

  /**
   * @en Native high-performance text stream parsing implementation.
   * @ru Нативная высокопроизводительная вычитка тела ответа в виде строки.
   */
  text(): Promise<string>;

  /**
   * @en Native high-performance async JSON stream parsing powered by runtime engine core.
   * @ru Нативный парсинг тела ответа в JSON на уровне Си++ движка рантайма.
   * @template T - Expected type of the parsed JSON.
   */
  json<T = unknown>(): Promise<T>;

  /**
   * @en Immediate stream drain helper to release and recycle the underlying socket.
   * @ru Сброс стрима в никуда для моментального освобождения сокета обратно в пул.
   */
  dump(): Promise<void>;
}

/**
 * @en Unified interface for building runtime-specific network transports.
 * @ru Общий интерфейс для реализации сетевых транспортов.
 */
export interface HyperTransport {
  /**
   * @en Executes a low-level network request based on the provided parameters.
   * @ru Выполняет низкоуровневый сетевой запрос на основе переданных параметров.
   * @param req - Normalized network request parameters.
   */
  execute(req: TransportRequest): Promise<TransportResponse>;

  /**
   * @en Gracefully closes the transport, waiting for active connections to complete.
   * @ru Мягкое закрытие транспорта с ожиданием завершения активных соединений.
   */
  close?(): Promise<void>;

  /**
   * @en Forcefully destroys the transport and closes all sockets immediately.
   * @ru Экстренное уничтожение транспорта и принудительное закрытие всех сокетов.
   */
  destroy?(): Promise<void>;
}
