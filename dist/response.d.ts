import type { RequestHeaders } from "./http.js";
/**
 * @en Interface for objects supporting secure isolated copy operations.
 * @ru Интерфейс для объектов, поддерживающих безопасное изолированное копирование.
 * @template T - Target return object type.
 */
export interface Cloneable<T> {
    /**
     * @en Generates an independent clone of the current object.
     * @ru Создает независимую копию текущего объекта.
     */
    clone(): T;
}
/**
 * @en Dictionary map of HTTP response headers.
 * @ru Словарь HTTP-заголовков ответа.
 */
export type ResponseHeaders = Record<string, string | string[]>;
/**
 * @en Unified typed response container wrapper.
 * @ru Единый типизированный контейнер ответа.
 * @template T - Type of the resolved response body structure.
 */
export interface HttpResponse<T = unknown> extends Cloneable<HttpResponse<T>> {
    /**
     * @en Numeric HTTP response status code (e.g., 200, 404).
     * @ru Числовой HTTP-код статуса ответа (например, 200, 404).
     */
    status: number;
    /**
     * @en Key-value map of response headers.
     * @ru Карта заголовков ответа ключ-значение.
     */
    headers: RequestHeaders;
    /**
     * @en Final resolved URL of the response.
     * @ru Финальный разрешенный URL ответа.
     */
    url?: string;
    /**
     * @en Parsed or raw response body data.
     * @ru Распарсенные или сырые данные тела ответа.
     */
    body: T;
    /**
     * @en Creates a deep isolated copy of the response.
     * @ru Создает глубокую изолированную копию ответа.
     */
    clone(): HttpResponse<T>;
    /**
     * @en Parses the response body as a text string.
     * @ru Парсит тело ответа как текстовую строку.
     */
    text?(): Promise<string>;
    /**
     * @en Parses the response body as JSON.
     * @ru Парсит тело ответа как JSON.
     * @template R - Expected type of the parsed JSON.
     */
    json?<R = unknown>(): Promise<R>;
    /**
     * @en Discards the response body to free up resources.
     * @ru Отбрасывает тело ответа для освобождения ресурсов.
     */
    dump?(): Promise<void>;
}
/**
 * @en Interface representing a raw streaming response.
 * @ru Интерфейс, представляющий сырой потоковый ответ.
 * @template TBody - Type of the response body stream.
 */
export interface StreamResponse<TBody = ReadableStream> {
    /**
     * @en Numeric HTTP response status code.
     * @ru Числовой HTTP-код статуса ответа.
     */
    status: number;
    /**
     * @en Key-value map of response headers.
     * @ru Карта заголовков ответа ключ-значение.
     */
    headers: ResponseHeaders;
    /**
     * @en The raw body stream.
     * @ru Сырой поток тела ответа.
     */
    body: TBody;
    /**
     * @en The final URL of the response.
     * @ru Финальный URL ответа.
     */
    url: string;
    /**
     * @en Abort signal associated with the stream.
     * @ru Сигнал прерывания, связанный с потоком.
     */
    signal?: AbortSignal;
    /**
     * @en Total content length in bytes, if known.
     * @ru Общая длина контента в байтах, если известна.
     */
    contentLength?: number;
    /**
     * @en Character encoding of the response content.
     * @ru Кодировка символов содержимого ответа.
     */
    encoding?: string;
}
/**
 * @en Metadata context used during response conversion or parsing.
 * @ru Метаданные контекста, используемые при конвертации или парсинге ответа.
 */
export interface ConversionMeta {
    /**
     * @en MIME type of the content.
     * @ru MIME-тип содержимого.
     */
    contentType?: string;
    /**
     * @en Content encoding (e.g., gzip, deflate).
     * @ru Кодирование содержимого (например, gzip, deflate).
     */
    contentEncoding?: string;
    /**
     * @en Source URL of the content.
     * @ru Исходный URL содержимого.
     */
    url?: string;
}
