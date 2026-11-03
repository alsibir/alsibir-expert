import { readFileSync } from 'node:fs';
import { defineConfig } from 'astro/config';
import starlight from '@astrojs/starlight';
import starlightBlog from 'starlight-blog';

const publicationTopics = JSON.parse(readFileSync(new URL('./src/data/publications.json', import.meta.url), 'utf8'));

export default defineConfig({
  site: "https://alsibir.github.io",
  base: "/alsibir-expert/",
  vite: { server: { allowedHosts: ['terminal.local'] } },
  trailingSlash: 'always',
  integrations: [
    starlight({
      title: 'AlSibir — документация и анализ',
      description: 'Техническая документация, системный анализ, ГОСТ 19/34/21, портфолио и практические материалы',
      favicon: '/favicon.svg',
      components: { Header: './src/components/Header.astro', Footer: './src/components/Footer.astro', SiteTitle: './src/components/SiteTitle.astro', Head: './src/components/Head.astro', Hero: './src/components/Hero.astro', PageTitle: './src/components/PageTitle.astro' },
      customCss: ['./src/styles/custom.css'],
      locales: { root: { label: 'Русский', lang: 'ru' } },
      expressiveCode: {
        shiki: {
          langs: [JSON.parse(readFileSync(new URL('./src/plantuml.tmLanguage.json', import.meta.url), 'utf8'))],
        },
      },
      plugins: [starlightBlog({ title: 'Публикации по дате', navigation: 'none' })],
      sidebar: [
        { label: 'Публикации', items: [
          { label: 'Каталог и маршруты чтения', slug: 'publications' },
          ...publicationTopics.map(topic => ({ label: topic.title, collapsed: true, items: topic.items.map(item => item.link ? { ...item, link: new URL(item.link, 'https://alsibir.github.io').href } : item) })),
          { label: 'Все публикации по дате', link: 'https://alsibir.github.io/alsibir-expert/blog/' },
          { label: 'Все теги', link: 'https://alsibir.github.io/alsibir-expert/tags/' },
        ] },
        { label: 'О специалисте', collapsed: true, items: [
          { label: 'О специалисте', slug: 'wiki/pages/about' },
          { label: 'Навыки и инструменты', slug: 'wiki/pages/skills' },
        ] },
        { label: 'Услуги', slug: 'wiki/pages/services' },
        { label: 'Портфолио', collapsed: true, items: [
          { label: 'Работы и учебные примеры', slug: 'wiki/pages/portfolio' },
          { autogenerate: { directory: 'wiki/portfolio' } },
        ] },
        { label: 'Контакты', slug: 'wiki/pages/contact' },
        { label: 'Справка и навигация', collapsed: true, items: [
          { label: 'Вопросы и ответы', slug: 'wiki/pages/faq' },
          { label: 'Карта сайта', slug: 'wiki/pages/sitemap' },
          { label: 'Путеводитель по публикациям', slug: 'wiki' },
          { label: 'О разделе публикаций', slug: 'blog/welcome' },
        ] },
      ],
    }),
  ],
});
