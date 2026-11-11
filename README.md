# app-headmad-qr-tools

Мини-приложение **QR-Tools** для экосистемы [MiniAppHub](https://github.com/MiniAppHub).

- Генерация QR-кодов (библиотека `qrcode-generator` 1.4.4, MIT) с экспортом в SVG.
- Распознавание QR с фото (через `BarcodeDetector`, где поддерживается).
- Фоновый модуль `public/api/qr.js` — `svg(text)` для других приложений.

## Установка / запуск
Откройте каталог MiniAppHub или оболочку `appshell`. Для локальной проверки:
```bash
python3 -m http.server 8080 --directory mapp/public
```

## Структура
`mapp/mapp.manifest.json` — манифест · `mapp/public/` — интерфейс · `mapp/public/api/` — фоновое API.

Версия 1.0.0 · Лицензия MIT.
