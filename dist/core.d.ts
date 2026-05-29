import { HttpResponse, InternalRequest } from "./hyper.js";
import { HttpClientOptions } from "./options.js";
import { RequestBodyData, RequestInterface } from "./request.js";
import type { StreamResponse } from "./stream.js";
/**
 * @ru Основной интерфейс клиента Hyperttp. Предоставляет высокоуровневые методы для выполнения HTTP-запросов,
 * управление жизненным циклом соединений и механизм интерцепторов для обработки запросов и ответов.
 * @en The main Hyperttp client interface. Provides high-level methods for HTTP requests,
 * connection lifecycle management, and an interceptor mechanism for request/response handling.
 */
export interface IHyperCore {
    /**
     * @ru Текущая неизменяемая конфигурация инстанса.
     * @en The current immutable instance configuration.
     */
    readonly config: HttpClientOptions;
    /**
     * @ru Низкоуровневый диспетчер запросов. Прогоняет запрос через стек интерцепторов
     * и выполняет его на текущем рантайме (Node.js/Bun/Browser).
     * @en Low-level request dispatcher. Processes the request through the interceptor stack
     * and executes it on the current runtime (Node.js/Bun/Browser).
     */
    dispatch<T = unknown>(req: InternalRequest): Promise<HttpResponse<T>>;
    /**
     * @ru Инициализация стримингового запроса (Server-Sent Events или Chunked Transfer Encoding).
     * @en Initializes a streaming request (Server-Sent Events or Chunked Transfer Encoding).
     */
    stream(req: RequestInterface | string, signal?: AbortSignal): Promise<StreamResponse<unknown>>;
    /** @ru GET запрос. @en Performs a GET request. */
    get<T = unknown>(req: RequestInterface | string, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /** @ru POST запрос. @en Performs a POST request. */
    post<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /** @ru PUT запрос. @en Performs a PUT request. */
    put<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /** @ru PATCH запрос. @en Performs a PATCH request. */
    patch<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /** @ru DELETE запрос. @en Performs a DELETE request. */
    delete<T = unknown>(req: RequestInterface | string, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /** @ru OPTIONS запрос. @en Performs an OPTIONS request. */
    options<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    /** @ru HEAD запрос (возвращает только заголовки). @en Performs a HEAD request (returns headers only). */
    head(req: RequestInterface | string, signal?: AbortSignal): Promise<HttpResponse<null>>;
    /**
     * @ru Мутирует текущий экземпляр, накатывая новые опции (удобно для плагинов/мидлварей).
     * @en Mutates the current instance by applying new options (useful for plugins/middleware).
     * @returns {this} Возвращает текущий инстанс для цепочечных вызовов.
     */
    extend(options: Partial<HttpClientOptions>): this;
    /**
     * @ru Создает изолированную копию клиента (наследуя текущие опции) с добавлением новых.
     * @en Creates an isolated client copy (inheriting current options) with additional settings.
     */
    create(options: Partial<HttpClientOptions>): IHyperCore;
    /**
     * @ru Принудительно разрывает все активные Keep-Alive соединения и очищает пулы рантайма.
     * @en Forcefully terminates all active Keep-Alive connections and clears runtime pools.
     */
    destroy(graceful?: boolean): Promise<void>;
    /**
     * @ru Выполняет запрос и возвращает тело ответа в виде строки через нативную вычитку потока рантаймом.
     * @en Executes a request and returns the response body as a string via native transport stream reading.
     */
    text(req: RequestInterface | string, signal?: AbortSignal): Promise<string>;
    /**
     * @ru Выполняет запрос и использует нативный высокопроизводительный парсинг рантайма для получения JSON.
     * @en Executes a request and utilizes the runtime's native high-performance parsing to retrieve JSON.
     */
    json<T = unknown>(req: RequestInterface | string, signal?: AbortSignal): Promise<T>;
    /**
     * @ru Выполняет запрос и моментально сбрасывает поток тела ответа в никуда (stream drain) для освобождения сокета.
     * @en Executes a request and immediately drains the response stream into nowhere to recycle the socket.
     */
    dump(req: RequestInterface | string, signal?: AbortSignal): Promise<void>;
}
