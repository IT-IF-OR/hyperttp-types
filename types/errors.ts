/**
 * @ru Расширенный интерфейс ошибок для совместимости и типизации сторонних исключений сетевых рантаймов.
 * @en Extended boundary interface for mapping runtime-specific network engine exceptions into unified errors.
 */
export interface HyperttpError extends Error {
  /**
   * @ru Строковый код ошибки или системного исключения.
   * @en Stringified internal exception identification or system code.
   */
  code?: string;
  /**
   * @ru HTTP-статус код ответа (совместимость со сторонними библиотеками).
   * @en Numerical HTTP status code alias for alternative runtime alignment.
   */
  status?: number;
  /**
   * @ru Системный или сетевой HTTP-статус код ошибки.
   * @en Strict numeric HTTP execution status payload code.
   */
  statusCode?: number;
}
