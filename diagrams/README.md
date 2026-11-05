# Схемы Mermaid

Исходник схемы обработки: `anonymization-cycle/processing-sequence.mmd`.
Изображение: `public/images/diagrams/anonymization-processing-sequence.svg`.

После `npm ci` выполнить `npm run diagrams:render`. Для установленного браузера
можно задать `PUPPETEER_EXECUTABLE_PATH`; иначе требуется браузер Puppeteer
(`npx puppeteer browsers install chrome-headless-shell`).

GitHub Actions преобразует схему локально перед сборкой сайта. В статье сохранён
код Mermaid; готовое изображение размещено непосредственно после него.
При изменении схемы необходимо синхронно обновить код статьи и файл `.mmd`.
