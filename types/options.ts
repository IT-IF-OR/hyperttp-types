import type { LogLevel } from "./http.js";
import type { NetworkOptions } from "./network.js";
import type { HyperPlugin } from "./plugin.js";
import type { RetryOptions } from "./retry.js";
import type { HyperTransport } from "./transport.js";

/**
 * @en Branding interface for Hyperttp plugin extensions.
 * @ru Интерфейс брендинга для расширений плагинов Hyperttp.
 */
export interface HyperttpPluginsExtension {
  /**
   * @en Internal brand marker.
   * @ru Внутренний маркер бренда.
   */
  readonly _hyperttpBrand?: never;
}

/**
 * @en Base configuration options for the HTTP client instance.
 * @ru Базовые конфигурационные опции для экземпляра HTTP-клиента.
 */
export interface BaseHttpClientOptions {
  /**
   * @en Base URL for all relative request paths.
   * @ru Базовый URL для всех относительных путей запросов.
   */
  baseURL?: string;

  /**
   * @en Network layer configuration overrides.
   * @ru Переопределения конфигурации сетевого уровня.
   */
  network?: Partial<NetworkOptions>;

  /**
   * @en Retry logic configuration overrides.
   * @ru Переопределения конфигурации логики повторных попыток.
   */
  retry?: Partial<RetryOptions>;

  /**
   * @en Custom low-level network transport implementation.
   * @ru Кастомный низкоуровневый транспорт (например, для тестов или специфичного рантайма).
   */
  customTransport?: HyperTransport;

  /**
   * @en Custom logger function for internal events.
   * @ru Пользовательская функция логирования для внутренних событий.
   * @param level - Log severity level.
   * @param message - Log message content.
   * @param meta - Optional additional metadata context.
   */
  logger?: (level: LogLevel, message: string, meta?: unknown) => void;

  /**
   * @en Enable verbose logging output.
   * @ru Включить подробный вывод логов.
   */
  verbose?: boolean;

  /**
   * @en Directories to scan for loading external plugins.
   * @ru Директории для сканирования и загрузки внешних плагинов.
   */
  pluginDirs?: string[];

  /**
   * @en List of plugin instances or module paths to register.
   * @ru Список экземпляров плагинов или путей к модулям для регистрации.
   */
  plugins?: (HyperPlugin | string)[];

  /**
   * @en Enable collection of performance metrics.
   * @ru Включить сбор метрик производительности.
   */
  trackMetrics?: boolean;
}

/**
 * @en Full configuration options for the Hyperttp client, including plugin extensions.
 * @ru Полные конфигурационные опции для клиента Hyperttp, включая расширения плагинов.
 */
export interface HttpClientOptions
  extends BaseHttpClientOptions, HyperttpPluginsExtension {}
