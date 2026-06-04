import type { HttpClientOptions } from "./options.js";
import type { InternalRequest } from "./request.js";
import type { HttpResponse } from "./response.js";
import type { HyperttpError } from "./error.js";
import type { IHyperCore, TransportResponse } from "./index.js";

/**
 * @en Execution phases available for plugin interception in the request pipeline.
 * @ru Фазы выполнения, доступные для перехвата плагином в конвейере запроса.
 */
export type PluginPhase =
  | "START"
  | "PREPARE"
  | "CONTROL"
  | "FORMAT"
  | "NETWORK"
  | "DATA";

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
 * @en Hyperttp plugin interface defining lifecycle hooks for request/response interception.
 * Plugins can operate across different pipeline phases and optionally transform requests,
 * responses, or handle errors.
 *
 * @ru Интерфейс плагина Hyperttp, определяющий хуки жизненного цикла для перехвата запросов и ответов.
 * Плагины могут работать на разных фазах конвейера и опционально изменять запросы,
 * ответы или обрабатывать ошибки.
 */
export interface HyperPlugin {
  /**
   * @en Unique plugin identifier used for debugging and deduplication.
   * @ru Уникальный идентификатор плагина для отладки и дедупликации.
   */
  readonly name: string;

  /**
   * @en Pipeline execution phase where the plugin is executed.
   * Controls when the plugin is invoked in the request lifecycle.
   *
   * @ru Фаза выполнения в конвейере, на которой выполняется плагин.
   * Определяет момент вызова плагина в жизненном цикле запроса.
   */
  readonly phase?: PluginPhase;

  /**
   * @en Execution mode of the plugin.
   * - "blocking": plugin can affect request flow
   * - "background": plugin runs without blocking pipeline
   *
   * @ru Режим выполнения плагина.
   * - "blocking": плагин может влиять на поток запроса
   * - "background": плагин выполняется асинхронно, не блокируя конвейер
   */
  readonly mode?: PluginExecutionMode;

  /**
   * @en Optional predicate to enable or disable plugin based on runtime configuration.
   * If omitted, plugin is always enabled.
   *
   * @ru Условие активации плагина на основе конфигурации клиента.
   * Если не указано — плагин всегда включён.
   */
  enabled?: (config: HttpClientOptions) => boolean;

  /**
   * @en Called once when plugin is registered.
   * Used for initialization, caching, or attaching runtime resources.
   *
   * @ru Вызывается один раз при регистрации плагина.
   * Используется для инициализации, кэширования или подготовки ресурсов.
   */
  setup?: (ctx: PluginContext) => void;

  /**
   * @en Hook executed before the request is dispatched.
   * Can modify the request or short-circuit execution by returning a response.
   *
   * @ru Хук, выполняемый перед отправкой запроса.
   * Может изменить запрос или прервать выполнение, вернув ответ.
   */
  onRequest?: (
    req: InternalRequest,
    ctx?: PluginContext,
  ) => Promise<HttpResponse<unknown> | void> | HttpResponse<unknown> | void;

  /**
   * @en Hook executed after a response is received and before formatting.
   * Useful for logging, metrics, or response transformation.
   *
   * @ru Хук, выполняемый после получения ответа и до форматирования.
   * Используется для логирования, метрик или трансформации ответа.
   */
  onResponse?: (
    res: HttpResponse<unknown>,
    req?: InternalRequest,
    ctx?: PluginContext,
  ) => Promise<void> | void;

  /**
   * @en Low-level hook executed when transport data is received.
   * Allows inspection or modification of raw transport response before parsing.
   *
   * @ru Низкоуровневый хук, вызываемый при получении данных транспорта.
   * Позволяет перехватывать или изменять сырой транспортный ответ до парсинга.
   */
  onResponseData?: (
    res: TransportResponse,
    ctx?: PluginContext,
  ) => Promise<TransportResponse | void> | TransportResponse | void;

  /**
   * @en Hook executed when an error occurs during request lifecycle.
   * Can recover by returning a valid response or let error propagate.
   *
   * @ru Хук, вызываемый при ошибке в жизненном цикле запроса.
   * Может восстановить выполнение, вернув ответ, или пропустить ошибку дальше.
   */
  onError?: (
    err: HyperttpError,
    req?: InternalRequest,
    ctx?: PluginContext,
  ) => Promise<HttpResponse<unknown> | void> | HttpResponse<unknown> | void;
}
