import type { HttpClientOptions } from "./options.js";
import type { HttpResponse, InternalRequest } from "./hyper.js";
import type { IHyperCore } from "./core.js";
import type { HyperttpError } from "./errors.js";
/**
 * @ru Фазы плоского последовательного конвейера, определяющие строгий порядок выполнения запроса.
 * @en Lifecycle phases defining strict sequential execution order within the flat client pipeline.
 */
export type PluginPhase = 
/**
 * @ru Точка старта: инициализация метрик, логирование, трассировка.
 * @en Entry point: metrics initialization, logging, and tracing.
 */
"START"
/**
 * @ru Подготовка: кэширование, дедупликация (могут вернуть ответ сразу, минуя сеть).
 * @en Preparation: caching and request deduplication (can short-circuit and return responses instantly).
 */
 | "PREPARE"
/**
 * @ru Трафик-контроль: rate-limiting, очереди коннектов, менеджмент инфлайт-запросов.
 * @en Traffic control: rate-limiting, connection pooling, inflight request management.
 */
 | "CONTROL"
/**
 * @ru Форматирование: сериализация тела запроса, парсинг ответов (JSON, Buffers).
 * @en Formatting: payload serialization and response parsing (JSON, Buffers).
 */
 | "FORMAT"
/**
 * @ru Чистый сетевой транспорт ядра (вызов нативного fetch/underlying транспорта).
 * @en Raw network transport engine layer.
 */
 | "NETWORK";
/**
 * @ru Режим исполнения хуков ответа (onResponse / onError).
 * @en Execution strategy for response hooks (onResponse / onError).
 */
export type PluginExecutionMode = 
/**
 * @ru Блокирующий режим: конвейер ждет выполнения хука через `await` (нужно для парсеров, кэша).
 * @en Blocking mode: the pipeline awaits the hook execution (required for parsers, caching).
 */
"blocking"
/**
 * @ru Фоновый режим: хук улетает в fire-and-forget, не задерживая сетевой ответ пользователю (метрики, логи).
 * @en Background mode: fire-and-forget execution, never delaying the network response to the user (metrics, logs).
 */
 | "background";
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
     * @ru Целевая фаза выполнения конвейера. Используется ядром для плоской сортировки при регистрации.
     * @en Target pipeline execution phase. Used by the core for flat sorting upon registration.
     */
    readonly phase: PluginPhase;
    /**
     * @ru Стратегия выполнения для фазы ответа. Если не указана, по умолчанию считается "blocking".
     * @en Execution strategy for the response/error phase. Defaults to "blocking" if omitted.
     */
    readonly mode?: PluginExecutionMode;
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
    onRequest?: (req: InternalRequest, ctx: PluginContext) => Promise<HttpResponse<unknown> | void> | HttpResponse<unknown> | void;
    /**
     * @ru Перехватчик фазы успешного ответа. В зависимости от `mode` может блокировать поток или уходить в фон.
     * @en Response phase interceptor hook. Depending on `mode`, it either blocks the pipeline or executes in the background.
     * @param res - Output HTTP client response reference.
     * @param req - Contextual internal request parameters.
     * @param ctx - Shared plugin execution context.
     */
    onResponse?: (res: HttpResponse<unknown>, req: InternalRequest, ctx: PluginContext) => Promise<void> | void;
    /**
     * @ru Перехватчик ошибок конвейера. Может перехватить исключение и вернуть HttpResponse для восстановления логики.
     * @en Error phase interceptor hook. Can swallow pipeline failures and return a fallback response container.
     * @param err - Normalized exception object payload.
     * @param req - Contextual internal request parameters.
     * @param ctx - Shared plugin execution context.
     * @returns Recovered response container or void statement execution.
     */
    onError?: (err: HyperttpError, req: InternalRequest, ctx: PluginContext) => Promise<HttpResponse<unknown> | void> | HttpResponse<unknown> | void;
}
