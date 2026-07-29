# Tariff microfrontend service

Микрофронтенд сервиса «Тарифы» для платформы NORM.

## Что входит

- маршрут `/tariff` без собственной внешней оболочки и сайдбара;
- информация о тарифе, договоре, компаниях и доступных модулях;
- список пользователей с поиском и фильтрами;
- активация и деактивация пользователей с контролем лимита тарифа;
- состояния loading, refreshing, empty, access pending/deactivated/failed;
- русский namespace i18n в JSON;
- MST-store и тесты прикладной логики.

## Runtime

Проект следует контракту соседних доменных сервисов NORM:

- entrypoint: `src/tariff-mf-app.tsx`;
- Single-SPA lifecycle: `bootstrap`, `mount`, `unmount`;
- host contracts: `@n-orm/auth-mf-app`, `baseUrl$`, `tenant$`, `user$`;
- UI Kit и общие компоненты поставляются внешним runtime;
- внешний layout, навигация и сайдбар не входят в этот микрофронтенд.

Подробный порядок встраивания и список точек интеграции находятся в
[`docs/TARIFF_INTEGRATION.md`](docs/TARIFF_INTEGRATION.md).

## Команды после подключения корпоративного registry

```powershell
npm install
npm run lint
npm run lint:ts
npm run test
npm run build
```

Локальный standalone `BrowserRouter` намеренно не добавлен: экран должен
проверяться в корневой Single-SPA-обвязке так же, как `risks` и `measures`.
