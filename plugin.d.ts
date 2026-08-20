import type { IHyperCore } from "./index.js";
import type { HyperClientOptions } from "./options.js";
import type { RequestContext, SendRequest, UniversalResponse } from "./sender.js";
/**
 * @ru Фазы выполнения, доступные для перехвата плагином в конвейере запроса.
 * @en Execution phases available for plugin interception in the request pipeline.
 */
export type PluginPhase = "START" | "PREPARE" | "CONTROL" | "FORMAT" | "NETWORK" | "DATA";
/**
 * @ru Режимы выполнения, определяющие влияние плагина на поток запроса.
 * @en Execution modes determining how the plugin affects the request flow.
 */
export type PluginExecutionMode = "blocking" | "background";
/**
 * @ru Контекст, предоставляемый плагину, содержащий конфигурацию и доступ к ядру.
 * @en Context provided to plugins, containing configuration and core access.
 */
export interface PluginContext {
    /**
     * @ru Текущая конфигурация клиента.
     * @en Current client configuration options.
     */
    readonly config: HyperClientOptions;
    /**
     * @ru Ссылка на экземпляр ядра.
     * @en Reference to the core instance.
     */
    readonly core: IHyperCore;
}
/**
 * @ru Результат выполнения хука `onRequest`: изменённый запрос, преждевременный ответ или отсутствие результата.
 * @en Result of the `onRequest` hook: a modified request, an early response, or no result.
 * @template TInput - The type of the request input.
 * @template TOutput - The type of the response data.
 */
export type PluginOnRequestResult<TInput = unknown, TOutput = unknown> = UniversalResponse<TOutput> | SendRequest<TInput> | void;
/**
 * @ru Протокол-независимые хуки жизненного цикла плагинов.
 * @en Protocol-agnostic plugin lifecycle hooks.
 * @template TInput - The type of the request input.
 * @template TOutput - The type of the response data.
 */
export interface HyperPlugin<TInput = unknown, TOutput = unknown> {
    /**
     * @ru Уникальное имя плагина для отладки и дедупликации.
     * @en Unique plugin name for debugging and deduplication.
     */
    readonly name: string;
    /**
     * @ru Фаза выполнения в конвейере запроса.
     * @en Pipeline execution phase where the plugin is invoked.
     */
    readonly phase?: PluginPhase;
    /**
     * @ru Режим выполнения плагина: блокирующий или фоновый.
     * @en Plugin execution mode: blocking or background.
     */
    readonly mode?: PluginExecutionMode;
    /**
     * @ru Предикат активации плагина на основе конфигурации клиента.
     * @en Predicate to enable or disable the plugin based on client configuration.
     * @param config - The client configuration.
     * @returns true if the plugin should be enabled.
     */
    enabled?: (config: HyperClientOptions) => boolean;
    /**
     * @ru Хук инициализации, вызываемый при регистрации плагина.
     * @en Initialization hook called when the plugin is registered.
     * @param ctx - The plugin context.
     */
    setup?: (ctx: PluginContext) => void;
    /**
     * @ru Хук, выполняемый перед отправкой запроса. Может изменить запрос или вернуть ответ досрочно.
     * @en Hook executed before the request is dispatched. Can modify the request or short-circuit execution.
     * @param req - The universal request.
     * @param ctx - The plugin context.
     * @param reqCtx - The per-request execution context (`state`/`meta` shared across phases).
     * @returns A modified request, an early response, or void.
     */
    onRequest?: (req: SendRequest<TInput>, ctx?: PluginContext, reqCtx?: RequestContext) => Promise<PluginOnRequestResult<TInput, TOutput>> | PluginOnRequestResult<TInput, TOutput>;
    /**
     * @ru Хук, выполняемый после получения ответа.
     * @en Hook executed after a response is received.
     * @param res - The universal response.
     * @param req - The original request.
     * @param ctx - The plugin context.
     * @param reqCtx - The per-request execution context (`state`/`meta` shared across phases).
     * @returns A modified response or void.
     */
    onResponse?: (res: UniversalResponse<TOutput>, req?: SendRequest<TInput>, ctx?: PluginContext, reqCtx?: RequestContext) => Promise<UniversalResponse<TOutput> | void> | UniversalResponse<TOutput> | void;
    /**
     * @ru Хук, выполняемый при ошибке в жизненном цикле запроса.
     * @en Hook executed when an error occurs during the request lifecycle.
     * @param err - The error that occurred.
     * @param req - The original request.
     * @param ctx - The plugin context.
     * @param reqCtx - The per-request execution context (`state`/`meta` shared across phases).
     * @returns A recovered response, or void to propagate the error.
     */
    onError?: (err: unknown, req?: SendRequest<TInput>, ctx?: PluginContext, reqCtx?: RequestContext) => Promise<UniversalResponse<TOutput> | void> | UniversalResponse<TOutput> | void;
}
