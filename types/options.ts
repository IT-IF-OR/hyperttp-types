import type { HyperPlugin } from "./plugin.js";
import type { HyperProtocol } from "./protocol.js";
import type { HyperReceiver } from "./receiver.js";
import type { RetryOptions } from "./retry.js";
import type { HyperSender } from "./sender.js";
import type { HyperTransport } from "./transport.js";

/**
 * @ru Уровни серьёзности логов.
 * @en Log severity levels.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * @ru Базовые конфигурационные опции для экземпляра клиента.
 * @en Base configuration options for a client instance.
 */
export interface BaseHyperClientOptions {
  /**
   * @ru Список модулей протоколов (sender и/или receiver) для регистрации при создании инстанса.
   * @en List of protocol modules (sender and/or receiver) to register when the instance is created.
   */
  protocols?: HyperProtocol[];

  /**
   * @ru Список сендеров протоколов для регистрации при создании клиента.
   * @en List of protocol senders to register when the client is created.
   */
  senders?: HyperSender[];

  /**
   * @ru Список ресиверов протоколов для регистрации при создании инстанса (серверная сторона).
   * @en List of protocol receivers to register when the instance is created (server side).
   */
  receivers?: HyperReceiver[];

  /**
   * @ru Кастомный низкоуровневый транспорт для выполнения сетевых операций
   * (например, для тестов или специфичного рантайма). Поведение при отсутствии опции определяется runtime-ядром.
   * @en Custom low-level transport for executing network operations
   * (e.g., for tests or a specific runtime). Behavior when omitted is determined by the runtime core.
   */
  customTransport?: HyperTransport;

  /**
   * @ru Кастомный сендер протокола; правила его использования определяются runtime-ядром.
   * @en Custom protocol sender; usage rules are determined by the runtime core.
   */
  customSender?: HyperSender;

  /**
   * @ru Переопределения конфигурации логики повторных попыток.
   * @en Retry logic configuration overrides.
   */
  retry?: Partial<RetryOptions>;

  /**
   * @ru Пользовательская функция логирования внутренних событий.
   * @en Custom logger function for internal events.
   * @param level - The log severity level.
   * @param message - The log message.
   * @param meta - Optional additional metadata context.
   */
  logger?: (level: LogLevel, message: string, meta?: unknown) => void;

  /**
   * @ru Включить подробный вывод логов.
   * @en Enable verbose logging output.
   */
  verbose?: boolean;

  /**
   * @ru Каталоги для сканирования и загрузки внешних плагинов.
   * @en Directories to scan for loading external plugins.
   */
  pluginDirs?: string[];

  /**
   * @ru Список экземпляров плагинов или путей к модулям для регистрации.
   * @en List of plugin instances or module paths to register.
   */
  plugins?: (HyperPlugin | string)[];

  /**
   * @ru Включить сбор метрик производительности.
   * @en Enable performance metrics collection.
   */
  trackMetrics?: boolean;
}

/**
 * @ru Полная конфигурация клиента, включая расширения плагинов.
 * @en Full client configuration, including plugin extensions.
 */
export interface HyperClientOptions extends BaseHyperClientOptions {}
