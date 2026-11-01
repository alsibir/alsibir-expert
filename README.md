# alsibir-expert

Astro/Starlight. Сайт: https://alsibir.github.io/alsibir-expert/.

## Работа с исходниками

Требуются Node.js 24 и Python 3. Рабочие файлы: src, public, scripts, astro.config.mjs. dist создаётся автоматически. Не редактировать опубликованные HTML-файлы вместо src.

```bash
npm ci
npm run dev -- --open /alsibir-expert/
npm run build
python3 scripts/audit.py
npm run preview -- --open /alsibir-expert/
```

## GitHub Pages

Workflow .github/workflows/deploy.yml: pull request — сборка и staging-static artifact; push main — сборка, проверка, сохранение dist в gh-pages и публикация официальным Pages action. Settings → Pages → Build and deployment → Source: GitHub Actions. Ветка gh-pages сохраняет HTML, но не является вторым параллельным источником деплоя. Выбран такой вариант, поскольку push от GITHUB_TOKEN сам по себе не запускает новую сборку Pages из ветки.

До слияния требуется проверить PR и раскрывающееся меню на мобильном экране. Финальные схемы ОРФО и Снежинки не согласованы. Предложения перекрёстных ссылок не внедрены: audit/proposed-internal-links.diff.

## Локальный переход на Git

Не выполнять git pull в старую смешанную директорию. Сохранить её отдельной резервной копией и клонировать репозиторий в новый соседний каталог. После проверки сборки заменить используемый каталог проекта. Существующие настройки меню запуска указывают на старый путь — выбрать новый каталог либо сохранить прежнее имя после резервирования.

```bash
git clone https://github.com/alsibir/alsibir-expert.git alsibir-expert-git
cd alsibir-expert-git
# Для проверки незавершённого релиза:
git switch release/audit-20261101
npm ci
npm run build
python3 scripts/audit.py
```

Для дальнейших изменений создавать отдельную ветку и pull request. Откат рабочего релиза — git revert коммита и push main; workflow соберёт предыдущую функциональность без переписывания истории.

## Уборка

python3 scripts/cleanup.py — просмотр; --apply — перемещение; --restore — возврат. Манифест относится к приложенному исходному архиву. В чистом клоне большинство перечисленных файлов уже отсутствует. Перемещённые данные не включаются в Git и dist. Остальные старые архивы и фотографии сохранены в исходном приложенном архиве и не переносятся в публичный репозиторий автоматически.

Отчёты: audit/TRASH_REPORT.md, audit/image-check.md, audit/palette.md, audit/menu-analysis.md, audit/illustration-prompts.md.
