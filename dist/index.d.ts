import type { HttpClientOptions } from "./options.js";
import type { InternalRequest, RequestInterface } from "./request.js";
import type { HttpResponse, StreamResponse } from "./response.js";
import type { RequestBodyData } from "./http.js";
import type { HyperPlugin } from "./plugin.js";
/**
 * @en Core interface for the Hyperttp client, providing request dispatching, plugin management, and lifecycle control.
 * @ru Основной интерфейс клиента Hyperttp, предоставляющий диспетчеризацию запросов, управление плагинами и контроль жизненного цикла.
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
     * @en Initiates a streaming request.
     * @ru Инициирует потоковый запрос.
     * @param req - Request configuration or URL string.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the stream response.
     */
    stream(req: RequestInterface | string, signal?: AbortSignal): Promise<StreamResponse<unknown>>;
    /**
     * @en Initiates a POST streaming request with a body.
     * @ru Инициирует POST потоковый запрос с телом.
     * @template T - Expected response body type.
     * @param req - Request configuration or URL string.
     * @param body - Request body data.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the stream response.
     */
    postStream<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<StreamResponse<T>>;
    /**
     * @en Performs a GET request.
     * @ru Выполняет GET запрос.
     * @template T - Expected response body type.
     * @param req - Request configuration or URL string.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the HTTP response.
     */
    get<T = unknown>(req: RequestInterface | string, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /**
     * @en Performs a POST request.
     * @ru Выполняет POST запрос.
     * @template T - Expected response body type.
     * @param req - Request configuration or URL string.
     * @param body - Request body data.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the HTTP response.
     */
    post<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /**
     * @en Performs a PUT request.
     * @ru Выполняет PUT запрос.
     * @template T - Expected response body type.
     * @param req - Request configuration or URL string.
     * @param body - Request body data.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the HTTP response.
     */
    put<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /**
     * @en Performs a PATCH request.
     * @ru Выполняет PATCH запрос.
     * @template T - Expected response body type.
     * @param req - Request configuration or URL string.
     * @param body - Request body data.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the HTTP response.
     */
    patch<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /**
     * @en Performs a DELETE request.
     * @ru Выполняет DELETE запрос.
     * @template T - Expected response body type.
     * @param req - Request configuration or URL string.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the HTTP response.
     */
    delete<T = unknown>(req: RequestInterface | string, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /**
     * @en Performs an OPTIONS request.
     * @ru Выполняет OPTIONS запрос.
     * @template T - Expected response body type.
     * @param req - Request configuration or URL string.
     * @param body - Optional request body data.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the HTTP response.
     */
    options<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /**
     * @en Performs a HEAD request.
     * @ru Выполняет HEAD запрос.
     * @param req - Request configuration or URL string.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the HTTP response with null body.
     */
    head(req: RequestInterface | string, signal?: AbortSignal): Promise<HttpResponse<null>>;
    /**
     * @en Creates a new client instance by merging provided options with the current configuration.
     * @ru Создает новый экземпляр клиента, объединяя предоставленные опции с текущей конфигурацией.
     * @param options - Partial configuration options to extend.
     * @returns A new IHyperCore instance.
     */
    extend(options: Partial<HttpClientOptions>): IHyperCore;
    /**
     * @en Creates a completely new client instance based on provided options.
     * @ru Создает полностью новый экземпляр клиента на основе предоставленных опций.
     * @param options - Partial configuration options for the new instance.
     * @returns A new IHyperCore instance.
     */
    create(options: Partial<HttpClientOptions>): IHyperCore;
    /**
     * @en Shuts down the client instance and releases resources.
     * @ru Завершает работу экземпляра клиента и освобождает ресурсы.
     * @param graceful - If true, waits for active requests to complete before closing.
     */
    destroy(graceful?: boolean): Promise<void>;
    /**
     * @en Performs a GET request and returns the response body as text.
     * @ru Выполняет GET запрос и возвращает тело ответа как текст.
     * @param req - Request configuration or URL string.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the response text.
     */
    text(req: RequestInterface | string, signal?: AbortSignal): Promise<string>;
    /**
     * @en Performs a GET request and parses the response body as JSON.
     * @ru Выполняет GET запрос и парсит тело ответа как JSON.
     * @template T - Expected type of the parsed JSON.
     * @param req - Request configuration or URL string.
     * @param signal - Optional abort signal.
     * @returns A promise resolving to the parsed JSON data.
     */
    json<T = unknown>(req: RequestInterface | string, signal?: AbortSignal): Promise<T>;
    /**
     * @en Performs a GET request and immediately discards the response body.
     * @ru Выполняет GET запрос и немедленно отбрасывает тело ответа.
     * @param req - Request configuration or URL string.
     * @param signal - Optional abort signal.
     * @returns A promise that resolves when the stream is drained.
     */
    dump(req: RequestInterface | string, signal?: AbortSignal): Promise<void>;
}
export * from "./http.js";
export * from "./options.js";
export * from "./request.js";
export * from "./response.js";
export * from "./plugin.js";
export * from "./metrics.js";
export * from "./error.js";
export * from "./transport.js";
