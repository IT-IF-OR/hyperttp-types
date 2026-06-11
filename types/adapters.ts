import type { IHyperCore } from "./index.js";

/**
 * @en Adapter interface that translates the Hyperttp API into a third-party library compatible format
 * (e.g., axios, ky, got). Allows using Hyperttp as a drop-in replacement without modifying user code.
 * @ru Интерфейс адаптера, который транслирует API Hyperttp в совместимый формат сторонней библиотеки
 * (например, axios, ky, got). Позволяет использовать Hyperttp как drop-in замену без изменения пользовательского кода.
 * @template T - The type of the adapted client instance returned by the adapter.
 */
export interface HyperAdapter<T> {
  /**
   * @en Unique adapter name (e.g., 'axios', 'ky').
   * @ru Уникальное имя адаптера (например, 'axios', 'ky').
   */
  readonly name: string;

  /**
   * @en Optional adapter version for compatibility tracking.
   * @ru Опциональная версия адаптера для отслеживания совместимости.
   */
  readonly version?: string;

  /**
   * @en Creates an adapted client based on the Hyperttp core.
   * @ru Создаёт адаптированный клиент на основе ядра Hyperttp.
   * @param core - The Hyperttp core instance to adapt.
   * @returns The adapted client instance of type T.
   */
  adapt(core: IHyperCore): T;
}
