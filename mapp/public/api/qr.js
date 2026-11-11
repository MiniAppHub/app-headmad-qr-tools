/**
 * Фоновый API QR-Tools: другие мини-приложения могут вызвать генерацию.
 * Подключение: dependencies: ["headmad.qr-tools"] в манифесте.
 * @module api/qr
 */
/**
 * @param {string} text
 * @returns {string} SVG
 */
export function svg(text) {
  const qr = qrcode(0, 'M');
  qr.addData(String(text));
  qr.make();
  return qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
}
