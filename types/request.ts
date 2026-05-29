import type {
  Method,
  ResponseType,
  RequestHeaders,
  RequestQuery,
  RequestBodyData,
} from "./http.js";

/**
 * @en Configuration object for constructing a low-level HTTP request.
 * @ru Конфигурационный объект для построения низкоуровневого HTTP-запроса.
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
}

/**
 * @en High-level interface representing a prepared HTTP request.
 * @ru Высокоуровневый интерфейс, представляющий подготовленный HTTP-запрос.
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
  headers: RequestHeaders;

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
   * @ru Словарь пользовательских метаданных для расширенного контекста.
   */
  meta?: Record<string, unknown>;
}

/**
 * @en Internal normalized representation of an HTTP request used by the core pipeline.
 * @ru Внутреннее нормализованное представление HTTP-запроса, используемое ядром конвейера.
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
   * @ru Инфраструктурные метаданные для конфигурации таймингов и типа ответа.
   */
  meta?: {
    timings?: {
      /**
       * @en Time spent on network operations in milliseconds.
       * @ru Время, затраченное на сетевые операции, в миллисекундах.
       */
      networkMs?: number;
    };
    /**
     * @en Expected response parsing strategy.
     * @ru Ожидаемая стратегия парсинга ответа.
     */
    responseType?: ResponseType;
  };
}
