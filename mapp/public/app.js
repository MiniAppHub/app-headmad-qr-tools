/**
 * QR-Tools: генерация (qrcode-generator, SVG) и чтение (BarcodeDetector, если доступен).
 * @module app
 */
import { MiniApp } from './api/sdk.js';

const $ = (id) => document.getElementById(id);
const app = new MiniApp();
let lastSvg = '';

// Вкладки
document.querySelectorAll('.tab').forEach((t) => t.addEventListener('click', () => {
  document.querySelectorAll('.tab').forEach((x) => x.classList.toggle('on', x === t));
  $('gen').hidden = t.dataset.tab !== 'gen';
  $('scan').hidden = t.dataset.tab !== 'scan';
}));

/**
 * Создаёт SVG QR-кода.
 * @param {string} text
 * @returns {string} SVG-разметка
 */
export function makeSvg(text) {
  // qrcode.js (глобальная qrcode): typeNumber 0 — авто, уровень коррекции M
  const qr = qrcode(0, 'M');
  qr.addData(text);
  qr.make();
  return qr.createSvgTag({ cellSize: 6, margin: 2, scalable: true });
}

$('make').addEventListener('click', async () => {
  const text = $('text').value.trim();
  if (!text) return;
  lastSvg = makeSvg(text);
  $('qr').innerHTML = lastSvg;
  $('save').hidden = false;
  // Сообщаем оболочке (не обязательно; ошибка игнорируется)
  app.call('ui.toast', { text: 'QR-код готов' });
});

$('save').addEventListener('click', () => {
  const blob = new Blob([lastSvg], { type: 'image/svg+xml' });
  const a = Object.assign(document.createElement('a'), { href: URL.createObjectURL(blob), download: 'qr.svg' });
  a.click();
  URL.revokeObjectURL(a.href);
});

$('file').addEventListener('change', async (e) => {
  const file = e.target.files[0];
  const out = $('result');
  if (!file) return;
  if (!('BarcodeDetector' in window)) {
    out.hidden = false;
    out.textContent = 'Распознавание недоступно в этом браузере. Используйте оболочку appshell.';
    return;
  }
  try {
    const bmp = await createImageBitmap(file);
    const codes = await new BarcodeDetector({ formats: ['qr_code'] }).detect(bmp);
    out.hidden = false;
    out.textContent = codes.length ? codes.map((c) => c.rawValue).join('\n') : 'QR-код не найден';
  } catch (err) {
    out.hidden = false;
    out.textContent = 'Ошибка: ' + err.message;
  }
});
