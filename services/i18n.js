import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import HttpBackend from 'i18next-http-backend';

i18n
  .use(HttpBackend)
  .use(initReactI18next)
  .init({
    fallbackLng: 'en',
    debug: true,
    backend: {
      loadPath: 'https://api.locize.app/52083e0c-074a-4885-9ca0-da007b121a86/{{version}}/{{lng}}/{{ns}}',
      projectId: 'your-project-id',
      apiKey: '81ffe411-c845-4dfe-aa94-bd9a79c5e8ea', // Optional, required only for private projects
      version: 'latest',
    },
  });

export default i18n;

