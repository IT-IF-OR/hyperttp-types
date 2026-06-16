import type { HttpClientOptions } from "./options.js";
import type { InternalRequest, RequestInterface } from "./request.js";
import type { HttpResponse } from "./response.js";
import type { RequestBodyData } from "./http.js";
import type { HyperPlugin } from "./plugin.js";
import type { HyperAdapter } from "./adapters.js";
import type { StreamResponse } from "./stream.js";

/**
 * @en Core interface for the Hyperttp client, providing request dispatching,
 * plugin management, and lifecycle control.
 * @ru Основной интерфейс клиента Hyperttp, предоставляющий диспетчеризацию запросов,
 * управление плагинами и контроль жизненного цикла.
 */
export interface IHyperCore {
  /**
   * @en The current immutable instance configuration.
   * @ru Текущая неизменяемая конфигурация инстанса.
   */
  readonly config: HttpClientOptions;

  /**
   * @en Dispatches an internal request through the full plugin and transport pipeline.
   * @ru Отправляет внутренний запрос через полный конвейер плагинов и транспорта.
   * @template T - Expected response body type.
   * @param req - The normalized internal request object.
   * @returns A promise resolving to the HTTP response.
   */
  dispatch<T = unknown>(req: InternalRequest): Promise<HttpResponse<T>>;

  /**
   * @en Registers a plugin into the client instance.
   * @ru Регистрирует плагин в экземпляре клиента.
   * @param plugin - The plugin instance to register.
   * @returns The current instance for chaining.
   */
  use(plugin: HyperPlugin): this;

  /**
   * @en Initiates a streaming GET request.
   * @ru Инициирует потоковый GET-запрос.
   * @param req - Request configuration or URL string.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the stream response.
   */
  stream(
    req: RequestInterface | string,
    signal?: AbortSignal,
  ): Promise<StreamResponse<unknown>>;

  /**
   * @en Initiates a streaming POST request with a body.
   * @ru Инициирует потоковый POST-запрос с телом.
   * @template T - Expected response body type.
   * @param req - Request configuration or URL string.
   * @param body - Request body data.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the stream response.
   */
  postStream<T = unknown>(
    req: RequestInterface | string,
    body?: RequestBodyData,
    signal?: AbortSignal,
  ): Promise<StreamResponse<T>>;

  /**
   * @en Performs a GET request.
   * @ru Выполняет GET-запрос.
   * @template T - Expected response body type.
   * @param req - Request configuration or URL string.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the HTTP response.
   */
  get<T = unknown>(
    req: RequestInterface | string,
    signal?: AbortSignal,
  ): Promise<HttpResponse<T>>;

  /**
   * @en Performs a POST request with a body.
   * @ru Выполняет POST-запрос с телом.
   * @template T - Expected response body type.
   * @param req - Request configuration or URL string.
   * @param body - Request body data.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the HTTP response.
   */
  post<T = unknown>(
    req: RequestInterface | string,
    body?: RequestBodyData,
    signal?: AbortSignal,
  ): Promise<HttpResponse<T>>;

  /**
   * @en Performs a PUT request with a body.
   * @ru Выполняет PUT-запрос с телом.
   * @template T - Expected response body type.
   * @param req - Request configuration or URL string.
   * @param body - Request body data.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the HTTP response.
   */
  put<T = unknown>(
    req: RequestInterface | string,
    body?: RequestBodyData,
    signal?: AbortSignal,
  ): Promise<HttpResponse<T>>;

  /**
   * @ru Выполняет PATCH-запрос с телом.
   * @en Performs a PATCH request with a body.
   * @template T - Expected response body type.
   * @param req - Request configuration or URL string.
   * @param body - Request body data.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the HTTP response.
   */
  patch<T = unknown>(
    req: RequestInterface | string,
    body?: RequestBodyData,
    signal?: AbortSignal,
  ): Promise<HttpResponse<T>>;

  /**
   * @en Performs a DELETE request.
   * @ru Выполняет DELETE-запрос.
   * @template T - Expected response body type.
   * @param req - Request configuration or URL string.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the HTTP response.
   */
  delete<T = unknown>(
    req: RequestInterface | string,
    signal?: AbortSignal,
  ): Promise<HttpResponse<T>>;

  /**
   * @en Performs an OPTIONS request.
   * @ru Выполняет OPTIONS-запрос.
   * @template T - Expected response body type.
   * @param req - Request configuration or URL string.
   * @param body - Optional request body data.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the HTTP response.
   */
  options<T = unknown>(
    req: RequestInterface | string,
    body?: RequestBodyData,
    signal?: AbortSignal,
  ): Promise<HttpResponse<T>>;

  /**
   * @en Performs a HEAD request (no response body).
   * @ru Выполняет HEAD-запрос (без тела ответа).
   * @param req - Request configuration or URL string.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the HTTP response with null body.
   */
  head(
    req: RequestInterface | string,
    signal?: AbortSignal,
  ): Promise<HttpResponse<null>>;

  /**
   * @en Creates a new client instance by merging the current configuration with provided options.
   * @ru Создаёт новый экземпляр клиента, объединяя текущую конфигурацию с переданными опциями.
   * @param options - Partial configuration options to extend.
   * @returns A new IHyperCore instance.
   */
  extend(options: Partial<HttpClientOptions>): IHyperCore;

  /**
   * @en Creates a completely new client instance based on provided options.
   * @ru Создаёт полностью новый экземпляр клиента на основе переданных опций.
   * @param options - Partial configuration options for the new instance.
   * @returns A new IHyperCore instance.
   */
  create(options: Partial<HttpClientOptions>): IHyperCore;

  /**
   * @ru Завершает работу клиента и освобождает ресурсы (соединения, пулы).
   * @en Shuts down the client and releases resources (connections, pools).
   * @param graceful - If true, waits for active requests to complete before closing.
   * @returns A promise that resolves when shutdown is complete.
   */
  destroy(graceful?: boolean): Promise<void>;

  /**
   * @en Performs a GET request and returns the response body as text.
   * @ru Выполняет GET-запрос и возвращает тело ответа как текст.
   * @param req - Request configuration or URL string.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the response text.
   */
  text(req: RequestInterface | string, signal?: AbortSignal): Promise<string>;

  /**
   * @en Performs a GET request and parses the response body as JSON.
   * @ru Выполняет GET-запрос и парсит тело ответа как JSON.
   * @template T - Expected type of the parsed JSON.
   * @param req - Request configuration or URL string.
   * @param signal - Optional abort signal.
   * @returns A promise resolving to the parsed JSON data.
   */
  json<T = unknown>(
    req: RequestInterface | string,
    signal?: AbortSignal,
  ): Promise<T>;

  /**
   * @en Performs a GET request and immediately discards the response body to free resources.
   * @ru Выполняет GET-запрос и немедленно отбрасывает тело ответа для освобождения ресурсов.
   * @param req - Request configuration or URL string.
   * @param signal - Optional abort signal.
   * @returns A promise that resolves when the stream is drained.
   */
  dump(req: RequestInterface | string, signal?: AbortSignal): Promise<void>;

  /**
   * @ru Применяет адаптер к ядру для получения совместимого API сторонней библиотеки.
   * Например, `core.adapter(axiosAdapter)` вернёт axios-совместимый инстанс.
   * @en Applies an adapter to the core to obtain a third-party library compatible API.
   * For example, `core.adapter(axiosAdapter)` returns an axios-compatible instance.
   * @template T - The type of the adapted client instance.
   * @param adapter - The adapter instance to apply.
   * @returns The adapted client instance of type T.
   */
  adapter?<T>(adapter: HyperAdapter<T>): T;
}

export * from "./adapters.js";
export * from "./error.js";
export * from "./http.js";
export * from "./metrics.js";
export * from "./network.js";
export * from "./options.js";
export * from "./plugin.js";
export * from "./request.js";
export * from "./response.js";
export * from "./retry.js";
export * from "./stealth.js";
export * from "./stream.js";
export * from "./transport.js";
