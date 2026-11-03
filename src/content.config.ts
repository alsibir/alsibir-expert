import { z } from 'astro/zod';
import { defineCollection } from 'astro:content';
import { docsLoader, i18nLoader } from '@astrojs/starlight/loaders';
import { docsSchema, i18nSchema } from '@astrojs/starlight/schema';
import { blogSchema } from 'starlight-blog/schema';

export const collections = {
  docs: defineCollection({
    loader: docsLoader(),
    schema: docsSchema({ extend: (context) => blogSchema(context).extend({ category: z.enum(["Техническая документация и ГОСТ", "Системный анализ и проектирование", "Реестры и регистрационные досье", "ИИ и защита данных", "Инструменты и автоматизация", "Рабочая среда: Windows и Linux", "Профессиональное развитие"]).optional() }) }),
  }),
  i18n: defineCollection({ loader: i18nLoader(), schema: i18nSchema() }),
};