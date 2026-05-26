import { HttpResponse, InternalRequest } from "./hyper.js";
import { HttpClientOptions } from "./options.js";
import { RequestBodyData, RequestInterface } from "./request.js";
import type { StreamResponse } from "./stream.js";
export interface IHyperCore {
    config: HttpClientOptions;
    dispatch<T = unknown>(req: InternalRequest): Promise<HttpResponse<T>>;
    stream(req: RequestInterface | string, signal?: AbortSignal): Promise<StreamResponse<unknown>>;
    get<T = unknown>(req: RequestInterface | string, signal?: AbortSignal): Promise<HttpResponse<T>>;
    post<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    put<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    patch<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    delete<T = unknown>(req: RequestInterface | string, signal?: AbortSignal): Promise<HttpResponse<T>>;
    options<T = unknown>(req: RequestInterface | string, body?: RequestBodyData, signal?: AbortSignal): Promise<HttpResponse<T>>;
    head(req: RequestInterface | string, signal?: AbortSignal): Promise<HttpResponse<null>>;
    extend(options: Partial<HttpClientOptions>): IHyperCore;
    create(options: Partial<HttpClientOptions>): IHyperCore;
    destroy(graceful?: boolean): Promise<void>;
}
