import type { HttpClientOptions } from "./options.js";
import type { HttpResponse, InternalRequest } from "./hyper.js";
import type { IHyperCore } from "./core.js";
import type { HyperttpError } from "./errors.js";
/**
 * @ru Фазы жизненного цикла, определяющие строгий порядок выполнения в «луковичной» (onion) архитектуре.
 * @en Lifecycle phases defining strict execution order within the client's onion architecture.
 */
export type PluginPhase = 
/**
 * @ru Метрики, логирование, трассировка (самый внешний слой).
 * @en Metrics, logging, tracing (the outermost layout layer).
 */
"START"
/**
 * @ru Кэширование, дедупликация (могут вернуть ответ сразу, минуя сеть).
 * @en Caching, request deduplication (can short-circuit and return responses instantly).
 */
 | "PREPARE"
/**
 * @ru Трафик-контроль: rate-limiting, очереди коннектов, менеджмент инфлайт-запросов.
 * @en Traffic control: rate-limiting, connection pooling, inflight request management.
 */
 | "CONTROL"
/**
 * @ru Сериализация тела запроса, парсинг ответов (JSON, XML, HTML).
 * @en Payload serialization, response parsing (JSON, XML, HTML structures).
 */
 | "FORMAT"
/**
 * @ru Чистый сетевой транспорт ядра (самый глубокий слой).
 * @en Raw network transport engine layer (the deepest core layer).
 */
 | "NETWORK";
/**
 * @ru Единый неизменяемый контекст для плагина, переиспользуемый для экономии аллокаций памяти.
 * @en Unified immutable plugin context shared across hooks to prevent excessive garbage collection.
 */
export interface PluginContext {
    /**
     * @ru Текущая конфигурация клиента.
     * @en Current client instance options.
     */
    readonly config: HttpClientOptions;
    /**
     * @ru Ссылка на активный инстанс управляющего ядра.
     * @en Reference to the active core engine instance.
     */
    readonly core: IHyperCore;
}
/**
 * @ru Сигнатура функции диспетчеризации запроса в конвейере.
 * @en Core request dispatch function signature within the client pipeline.
 * @template T - Expected response body type.
 * @param req - Prepared internal request object.
 * @returns Formatted HTTP response promise container.
 */
export type DispatchFn = <T = unknown>(req: InternalRequest) => Promise<HttpResponse<T>>;
/**
 * @ru Функция-обертка (декоратор) для диспетчера, формирующая слой луковичной архитектуры.
 * @en Middleware decorator wrapper for the dispatch function forming an onion layer.
 * @param next - Next dispatch layer executor function.
 * @param ctx - Shared plugin execution context.
 * @returns Wrapped runtime dispatch function.
 */
export type WrapDispatch = (next: DispatchFn, ctx: PluginContext) => DispatchFn;
/**
 * @ru Интерфейс для проектирования расширений функционала ядра HyperCore.
 * @en Interface for designing extension plugins for the HyperCore processing engine.
 */
export interface HyperPlugin {
    /**
     * @ru Уникальное имя плагина для логирования, отладки и предотвращения дублирования.
     * @en Unique plugin name identifier for tracking, logging, and deduplication.
     */
    readonly name: string;
    /**
     * @ru Динамическая проверка необходимости активации плагина на основе переданной конфигурации.
     * @en Dynamic check to evaluate if the plugin should activate based on provided client settings.
     * @param config - Target client configurations to match against.
     * @returns Lifecycle activation indicator.
     */
    enabled: (config: HttpClientOptions) => boolean;
    /**
     * @ru Хук инициализации плагина. Вызывается один раз при создании экземпляра клиента.
     * @en One-time initialization lifecycle hook triggered instantly during client orchestration setup.
     * @param ctx - Shared plugin execution context.
     */
    setup?: (ctx: PluginContext) => void;
    /**
     * @ru Перехватчик фазы запроса. Возврат HttpResponse прерывает цепочку выполнения и отменяет сетевой запрос.
     * @en Request phase interceptor hook. Returning a response short-circuits execution, bypassing subsequent network layers.
     * @param req - Contextual internal request parameters.
     * @param ctx - Shared plugin execution context.
     * @returns Short-circuit response, async promise wrapper or void execution.
     */
    onRequest?: (req: InternalRequest, ctx: PluginContext) => Promise<HttpResponse<any> | void> | HttpResponse<any> | void;
    /**
     * @ru Перехватчик фазы успешного ответа. Используется для пост-обработки, логирования или наполнения кэша.
     * @en Response phase interceptor hook used for data post-processing, analytics, or caching.
     * @param res - Output HTTP client response reference.
     * @param req - Contextual internal request parameters.
     * @param ctx - Shared plugin execution context.
     */
    onResponse?: (res: HttpResponse<any>, req: InternalRequest, ctx: PluginContext) => Promise<void> | void;
    /**
     * @ru Перехватчик ошибок конвейера. Может перехватить исключение и вернуть HttpResponse для восстановления логики.
     * @en Error phase interceptor hook. Can swallow pipeline failures and return a fallback response container.
     * @param err - Normalized exception object payload.
     * @param req - Contextual internal request parameters.
     * @param ctx - Shared plugin execution context.
     * @returns Recovered response container or void statement execution.
     */
    onError?: (err: HyperttpError, req: InternalRequest, ctx: PluginContext) => Promise<HttpResponse<any> | void> | HttpResponse<any> | void;
}
