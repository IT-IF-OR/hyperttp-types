/**
 * @ru Уровни логирования для фильтрации и управления выводом диагностических сообщений клиента.
 * @en Log levels for filtering and controlling client diagnostic output messages.
 */
export type LogLevel = "debug" | "info" | "warn" | "error";

/**
 * @ru Поддерживаемые HTTP-методы (глаголы) для выполнения сетевых запросов.
 * @en Supported HTTP method verbs for executing network requests.
 */
export type Method =
  | "GET"
  | "POST"
  | "PUT"
  | "PATCH"
  | "OPTIONS"
  | "DELETE"
  | "HEAD";

/**
 * @ru Ожидаемый формат автоматического или принудительного парсинга входящего тела ответа.
 * @en Expected format for automatic or forced parsing of the incoming response body payload.
 */
export type ResponseType =
  | "auto"
  | "json"
  | "text"
  | "xml"
  | "html"
  | "buffer"
  | "stream"
  | "blob";

/**
 * @ru Тип исходного формата сырых данных, используемый для сериализации или контент-анализа.
 * @en Source data format type used for payload serialization or content analysis.
 */
export type SourceType = "json" | "xml" | "html" | "text" | "buffer";
