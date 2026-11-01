import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';

export default defineConfig({
  site: "https://alsibir.github.io",
  base: "/alsibir-expert/",
  vite: { server: { allowedHosts: ['terminal.local'] } },
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'AlSibir — документация и анализ',
      description: 'Техническая документация, системный анализ, ГОСТ 19/34, портфолио и практические материалы',
      favicon: '/favicon.svg',
      components: { Header: './src/components/Header.astro', Footer: './src/components/Footer.astro', SiteTitle: './src/components/SiteTitle.astro', Head: './src/components/Head.astro', Hero: './src/components/Hero.astro', PageTitle: './src/components/PageTitle.astro' },
      customCss: ['./src/styles/custom.css'],
      locales: { root: { label: 'Русский', lang: 'ru' } },
      expressiveCode: {
        shiki: {
          langs: [JSON.parse(readFileSync(new URL('./src/plantuml.tmLanguage.json', import.meta.url), 'utf8'))],
        },
      },
      plugins: [starlightBlog({ title: 'Блог' })],
      sidebar: [
        { label: 'Начало', items: [
          { label: 'База знаний', slug: 'wiki' },
          { label: 'О специалисте', slug: 'wiki/pages/about' },
          { label: 'Услуги', slug: 'wiki/pages/services' },
          { label: 'Портфолио', slug: 'wiki/pages/portfolio' },
          { label: 'Контакты', slug: 'wiki/pages/contact' },
        ] },
        { label: 'Профессиональные материалы', items: [
          { label: 'Навыки и инструменты', slug: 'wiki/pages/skills' },
          { label: 'Стандарты', slug: 'wiki/pages/standards' },
          { label: 'Образцы документов', slug: 'wiki/pages/worksamples' },
          { label: 'Термины и сокращения', slug: 'reference/example' },
          { label: 'Подготовка комплекта', slug: 'guides/example' },
        ] },
        { label: 'Учебное портфолио', items: [{ autogenerate: { directory: 'wiki/portfolio' } }] },
        { label: 'Учебные комплекты реестров', items: [{ autogenerate: { directory: 'wiki/examples' } }] },
        { label: 'Дополнительные страницы', items: [
          { label: 'Вопросы и ответы', slug: 'wiki/pages/faq' },
          { label: 'Карта сайта', slug: 'wiki/pages/sitemap' },
          { label: 'Политика конфиденциальности', slug: 'wiki/pages/pp' },
        ] },
      ],
    }),
  ],
});
