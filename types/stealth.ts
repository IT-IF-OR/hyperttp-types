/**
 * @en Browser fingerprint profiles for TLS simulation (JA3/JA4).
 * @ru Профили отпечатков браузера для симуляции TLS (JA3/JA4).
 */
export type Fingerprint = "chrome" | "firefox" | "safari" | "edge";

/**
 * @en Stealth and obfuscation settings for network traffic.
 * @ru Настройки скрытности и обфускации сетевого трафика.
 */
export interface StealthOptions {
  /**
   * @en Browser fingerprint to mimic (TLS handshakes, cipher suites, etc.).
   * @ru Отпечаток браузера для имитации (TLS-рукопожатия, наборы шифров и т.д.).
   */
  fingerprint?: Fingerprint;

  /**
   * @en Custom OpenSSL cipher suite string. Overrides fingerprint-derived ciphers.
   * @ru Кастомная строка шифров OpenSSL. Переопределяет шифры из fingerprint.
   */
  ciphers?: string;

  /**
   * @en Force HTTP/2 SETTINGS frame to match the fingerprint profile.
   * @ru Принудительная установка HTTP/2 SETTINGS под профиль fingerprint.
   */
  http2?: boolean;

  /**
   * @en TLS Client Hello fragmentation strategy for DPI evasion.
   * @ru Стратегия фрагментации TLS Client Hello для обхода DPI.
   */
  fragment?: "split" | "none";
}
