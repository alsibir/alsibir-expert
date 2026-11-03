import { readFileSync, writeFileSync } from 'node:fs';
const topics = JSON.parse(readFileSync(new URL('../src/data/publications.json', import.meta.url), 'utf8'));
const link = item => `- [${item.label}](${item.link ?? '/alsibir-expert/' + item.slug + '/'})`;
const intro = `---
title: 'Публикации'
description: 'Тематический каталог практических материалов по документации, системному анализу и рабочим инструментам.'
draft: false
---

Методические материалы, практические статьи и учебные комплекты объединены по задачам читателя. Выберите тему или начните с одного из маршрутов.

## С чего начать

- **Подготовить документацию:** [состав комплекта по ГОСТ 19](/alsibir-expert/blog/documentation/01_gost19_documents/) → [однозначное техническое задание](/alsibir-expert/blog/documentation/clear-technical-specification/) → [контроль качества](/alsibir-expert/blog/documentation/05_document_quality/).
- **Разобраться в требованиях и диаграммах:** [сбор исходных данных](/alsibir-expert/blog/analytics/project-discovery-ai/) → [BPMN, UML и PlantUML](/alsibir-expert/blog/modeling/08_bpmn_uml_plantuml/) → [трассируемость до испытаний](/alsibir-expert/blog/analytics/06_requirements_to_tests/).
- **Собрать регистрационное досье:** [реестр Минцифры](/alsibir-expert/blog/registries/01_mincifry_registry_software/) или [Минпромторг и ГИСП](/alsibir-expert/blog/registries/02_minpromtorg_registry_industry/) → [учебные комплекты](/alsibir-expert/wiki/pages/portfolio/#учебные-комплекты).

## Темы публикаций

| Тема | Материалов |
| --- | ---: |
`;
const table = topics.map(t => `| [${t.title}](#${t.id}) | ${t.items.length} |`).join('\n');
const sections = topics.map(t => `<span id="${t.id}"></span>\n\n## ${t.title}\n\nМатериалов: ${t.items.length}.\n\n${t.items.map(link).join('\n')}`).join('\n\n');
const ending = `

## Другие способы поиска

- [Все публикации по дате](/alsibir-expert/blog/).
- [Все теги статей](/alsibir-expert/tags/) — сквозные признаки: технологии, стандарты, инструменты и виды материалов.
- [Портфолио и учебные примеры](/alsibir-expert/wiki/pages/portfolio/).
- [О специалисте](/alsibir-expert/wiki/pages/about/), [услуги](/alsibir-expert/wiki/pages/services/) и [контакты](/alsibir-expert/wiki/pages/contact/).

Каждый материал относится к одной основной теме; теги позволяют находить связанные статьи из разных тем. Адреса ранее опубликованных материалов сохранены.
`;
writeFileSync(new URL('../src/content/docs/publications.md', import.meta.url), intro + table + '\n\n' + sections + ending);
