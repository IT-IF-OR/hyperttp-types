import type { HttpClientOptions } from "./options.js";
import type { InternalRequest } from "./request.js";
import type { HttpResponse } from "./response.js";
import type { HyperttpError } from "./error.js";
import type { IHyperCore } from "./index.js";
/**
 * @en Execution phases available for plugin interception in the request pipeline.
 * @ru Фазы выполнения, доступные для перехвата плагином в конвейере запроса.
 */
export type PluginPhase = "START" | "PREPARE" | "CONTROL" | "FORMAT" | "NETWORK";
/**
 * @en Execution modes determining how the plugin affects the request flow.
 * @ru Режимы выполнения, определяющие влияние плагина на поток запроса.
 */
export type PluginExecutionMode = "blocking" | "background";
/**
 * @en Context object provided to plugins, containing configuration and core access.
 * @ru Объект контекста, предоставляемый плагинам, содержащий конфигурацию и доступ к ядру.
 */
export interface PluginContext {
    /**
     * @en Current HTTP client configuration options.
     * @ru Текущие опции конфигурации HTTP-клиента.
     */
    readonly config: HttpClientOptions;
    /**
     * @en Reference to the core Hyper instance.
     * @ru Ссылка на основной экземпляр Hyper.
     */
    readonly core: IHyperCore;
}
/**
 * @en Function signature for dispatching a request through the remaining pipeline.
 * @ru Сигнатура функции для отправки запроса через оставшуюся часть конвейера.
 * @template T - Expected response body type.
 * @param req - The internal request object.
 * @returns A promise resolving to the HTTP response.
 */
export type DispatchFn = <T = unknown>(req: InternalRequest) => Promise<HttpResponse<T>>;
/**
 * @en Interface defining the structure and lifecycle hooks of a Hyperttp plugin.
 * @ru Интерфейс, определяющий структуру и хуки жизненного цикла плагина Hyperttp.
 */
export interface HyperPlugin {
    /**
     * @en Unique name of the plugin for debugging and deduplication.
     * @ru Уникальное имя плагина для отладки и дедупликации.
     */
    readonly name: string;
    /**
     * @en Execution phase in the request pipeline.
     * @ru Фаза выполнения в конвейере запроса.
     * @default "PREPARE"
     */
    readonly phase?: PluginPhase;
    /**
     * @en Execution mode determining if the plugin blocks the pipeline or runs in background.
     * @ru Режим выполнения, определяющий, блокирует ли плагин конвейер или работает в фоне.
     * @default "blocking"
     */
    readonly mode?: PluginExecutionMode;
    /**
     * @en Predicate function to determine if the plugin should be active for the given config.
     * @ru Функция-предикат для определения активности плагина для данной конфигурации.
     * @default () => true
     * @param config - The current client configuration.
     * @returns `true` if the plugin should be enabled.
     */
    enabled?: (config: HttpClientOptions) => boolean;
    /**
     * @en Initialization hook called when the plugin is registered.
     * @ru Хук инициализации, вызываемый при регистрации плагина.
     * @param ctx - The plugin context containing config and core reference.
     */
    setup?: (ctx: PluginContext) => void;
    /**
     * @en Hook invoked during the request processing phase. Can modify the request or return a response early.
     * @ru Хук, вызываемый во время обработки запроса. Может изменять запрос или возвращать ответ досрочно.
     * @param req - The internal request object.
     * @param ctx - Optional plugin context.
     * @returns A response object to short-circuit the pipeline, or void to continue.
     */
    onRequest?: (req: InternalRequest, ctx?: PluginContext) => Promise<HttpResponse<unknown> | void> | HttpResponse<unknown> | void;
    /**
     * @en Hook invoked after a successful response is received.
     * @ru Хук, вызываемый после получения успешного ответа.
     * @param res - The HTTP response object.
     * @param req - The original internal request object.
     * @param ctx - Optional plugin context.
     */
    onResponse?: (res: HttpResponse<unknown>, req?: InternalRequest, ctx?: PluginContext) => Promise<void> | void;
    /**
     * @en Hook invoked when an error occurs during request processing.
     * @ru Хук, вызываемый при возникновении ошибки во время обработки запроса.
     * @param err - The error object.
     * @param req - The original internal request object.
     * @param ctx - Optional plugin context.
     * @returns A response object to recover from the error, or void to propagate the error.
     */
    onError?: (err: HyperttpError, req?: InternalRequest, ctx?: PluginContext) => Promise<HttpResponse<unknown> | void> | HttpResponse<unknown> | void;
}
