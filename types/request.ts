import type {
  Method,
  ResponseType,
  RequestHeaders,
  RequestQuery,
  RequestBodyData,
} from "./http.js";
import type { StealthOptions } from "./stealth.js";

/**
 * @en Configuration object for constructing a low-level HTTP request.
 * Allows explicitly specifying scheme, host, port, and path separately.
 * @ru Конфигурационный объект для построения низкоуровневого HTTP-запроса.
 * Позволяет явно указывать схему, хост, порт и путь отдельно.
 */
export interface RequestConfig {
  /**
   * @en URL scheme (e.g., 'http', 'https').
   * @ru Схема URL (например, 'http', 'https').
   */
  scheme: string;

  /**
   * @en Target hostname or IP address.
   * @ru Целевое имя хоста или IP-адрес.
   */
  host: string;

  /**
   * @en Target port number.
   * @ru Номер целевого порта.
   */
  port?: number;

  /**
   * @en URL path string.
   * @ru Строка пути URL.
   */
  path?: string;

  /**
   * @en Dictionary of request headers.
   * @ru Словарь заголовков запроса.
   */
  headers?: RequestHeaders;

  /**
   * @en URL query parameters map.
   * @ru Карта параметров query строки URL.
   */
  query?: RequestQuery;

  /**
   * @en Request body payload data.
   * @ru Данные полезной нагрузки тела запроса.
   */
  bodyData?: RequestBodyData;

  /**
   * @en Core settings for traffic camouflage and deep packet inspection (DPI) bypass.
   * @ru Настройки маскировки трафика и обхода систем глубокого анализа пакетов (DPI).
   */
  stealth?: StealthOptions;
}

/**
 * @en High-level interface representing a prepared HTTP request.
 * Used as an input parameter for HyperCore methods (get, post, etc.).
 * @ru Высокоуровневый интерфейс, представляющий подготовленный HTTP-запрос.
 * Используется как входной параметр для методов HyperCore (get, post и т.д.).
 */
export interface RequestInterface {
  /**
   * @en Full target URL string.
   * @ru Полная строка целевого URL.
   */
  url: string;

  /**
   * @en Dictionary of request headers.
   * @ru Словарь заголовков запроса.
   */
  headers?: RequestHeaders;

  /**
   * @en Request body payload data.
   * @ru Данные полезной нагрузки тела запроса.
   */
  body?: RequestBodyData;

  /**
   * @en URL query parameters map.
   * @ru Карта параметров query строки URL.
   */
  query?: RequestQuery;

  /**
   * @en Abort signal for cancelling the request.
   * @ru Сигнал прерывания для отмены запроса.
   */
  signal?: AbortSignal;

  /**
   * @en Custom metadata dictionary for extended context.
   * Can be used by plugins to pass additional information.
   * @ru Словарь пользовательских метаданных для расширенного контекста.
   * Может использоваться плагинами для передачи дополнительной информации.
   */
  meta?: Record<string, unknown>;

  /**
   * @en HTTP method (GET, POST, etc.). Defaults to GET if not specified.
   * @ru HTTP-метод (GET, POST и т.д.). Если не указан, используется GET.
   */
  method?: Method;

  /**
   * @en Core settings for traffic camouflage and deep packet inspection (DPI) bypass for this specific request.
   * @ru Настройки маскировки трафика и обхода систем глубокого анализа пакетов (DPI) для конкретного запроса.
   */
  stealth?: StealthOptions;
}

/**
 * @en Internal normalized representation of an HTTP request used by the core pipeline.
 * Created by HyperCore.acquireReq() and passed to the transport layer.
 * @ru Внутреннее нормализованное представление HTTP-запроса, используемое ядром конвейера.
 * Создаётся методом HyperCore.acquireReq() и передаётся в транспортный слой.
 */
export interface InternalRequest {
  /**
   * @en HTTP method (GET, POST, etc.).
   * @ru HTTP-метод (GET, POST и т.д.).
   */
  method: Method;

  /**
   * @en Full target URL string.
   * @ru Полная строка целевого URL.
   */
  url: string;

  /**
   * @en Dictionary of request headers.
   * @ru Словарь заголовков запроса.
   */
  headers: RequestHeaders;

  /**
   * @en Request body payload data.
   * @ru Данные полезной нагрузки тела запроса.
   */
  body?: RequestBodyData;

  /**
   * @en Abort signal for cancelling the request.
   * @ru Сигнал прерывания для отмены запроса.
   */
  signal?: AbortSignal;

  /**
   * @en Infrastructure metadata for timing and response type configuration.
   * Extensible object — plugins can add their own fields via the index signature.
   * @ru Инфраструктурные метаданные для конфигурации таймингов и типа ответа.
   * Расширяемый объект — плагины могут добавлять свои поля через index signature.
   */
  meta?: {
    /**
     * @en Timing measurements for network operations.
     * @ru Замеры времени выполнения сетевых операций.
     */
    timings?: {
      /**
       * @en Time spent on network operations in milliseconds.
       * @ru Время, затраченное на сетевые операции, в миллисекундах.
       */
      networkMs?: number;
    };
    /**
     * @en Expected response parsing strategy (auto, json, text, stream, etc.).
     * @ru Ожидаемая стратегия парсинга ответа (auto, json, text, stream и т.д.).
     */
    responseType?: ResponseType;

    /**
     * @en Extensible field for custom plugin metadata.
     * @ru Расширяемое поле для пользовательских метаданных от плагинов.
     */
    [key: string]: unknown;
  };

  /**
   * @en Applied stealth configuration for camouflage and DPI bypass.
   * @ru Примененная конфигурация скрытности для маскировки и обхода DPI.
   */
  stealth?: StealthOptions;
}
