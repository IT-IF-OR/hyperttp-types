/**
 * @en Valid HTTP methods.
 * @ru Допустимые HTTP-методы.
 */
export type Method = "GET" | "POST" | "PUT" | "PATCH" | "DELETE" | "OPTIONS" | "HEAD";
/**
 * @en Expected response body parsing types.
 * @ru Допустимые стратегии автоматического парсинга ответа.
 */
export type ResponseType = "auto" | "json" | "text" | "xml" | "stream" | "blob" | "html" | "buffer";
/**
 * @en Logger urgency levels for the core internal logger.
 * @ru Уровни логирования для внутреннего логгера ядра.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";
/**
 * @en Request HTTP headers dictionary map.
 * @ru Словарь HTTP-заголовков запроса.
 */
export type RequestHeaders = Record<string, string | string[]>;
/**
 * @en URL query string parameters map.
 * @ru Параметры URL query строки.
 */
export type RequestQuery = Record<string, string | string[] | number | boolean | undefined | null>;
/**
 * @en Allowed request body data types.
 * @ru Тип допустимых данных для тела запроса.
 */
export type RequestBodyData = string | Buffer | Uint8Array | ReadableStream | URLSearchParams | FormData | null | undefined | unknown;
