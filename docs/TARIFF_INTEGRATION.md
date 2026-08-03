# Передача сервиса «Тарифы» во frontend-разработку

## 1. Зафиксированный target-контракт

Архитектура сверена с тремя предоставленными репозиториями:

- `sberorm-cloud-risks-front/src/risks-mf-app.tsx`;
- `sberorm-cloud-risks-front/src/providers/index.tsx`;
- `sberorm-cloud-risks-front/src/providers/router/`;
- `sberorm-cloud-measures-front/src/providers/`;
- `sberorm-cloud-agent-risks-front/src/providers/`.

Сервис поставляется как Single-SPA microfrontend. Внешняя оболочка NORM владеет
сайдбаром, общим layout, runtime-зависимостями и базовым URL. Сам сервис владеет
только маршрутом `/tariff` и его содержимым шириной 960 px.

### Актуальные продуктовые уточнения

- тарифный слот занимает активный пользователь с ролью РМ
  (`ORMCLOUD_RISKMANAGER`) или РК (`ORMCLOUD_COORDINATOR`); отдельного
  изменяемого поля `inTariff` в модели нет;
- строка `Активных пользователей X из Y` считает только такие роли, а значение
  `Y` приходит из договора на backend и может отличаться у разных компаний;
- интерфейс показывает весь каталог модулей; `includedInContract` отвечает за
  договор, а `roleAvailable` — за доступ текущей роли. Эти признаки нельзя
  объединять;
- белый чип модуля означает фактическую доступность
  (`includedInContract && roleAvailable`); любой недоступный модуль отображается
  серым без hover-эффекта, но открывает информационный popover. Переход в сервис
  для него disabled;
- превышение лимита блокируется закрываемым `Alert` между фильтрами и списком,
  а switch остаётся в исходном состоянии;
- успешная активация показывается через `Notification` сверху по центру;
- названия быстрых фильтров в согласованном интерфейсе — `Все / Тариф / Гостевой`.

Эти решения соответствуют последним согласованным макетам и заменяют ранние
формулировки one-shot задания там, где они расходятся.

## 2. Зависимости

| Зависимость | Решение | Действие продуктовой команды |
|---|---|---|
| `@sber-orm/ui-kit` | `target-provided` | Подключить штатную версию через корпоративный registry/import map. Не возвращать `vendor/` |
| `@sber-orm/types__ui-kit` | `reuse` | Установить типы той же версии, что использует shell |
| `@sber-orm/components` | `reuse` | Оставить общий `ClickStreamProvider` |
| `@n-orm/auth-mf-app` | `target-provided` | Зарегистрировать внешний модуль в import map; используются `baseUrl$`, `tenant$`, `user$` |
| `single-spa-react` | `reuse` | Сохранить lifecycle из `src/tariff-mf-app.tsx` |
| MobX / MST | `reuse` | Подключить версии, согласованные с соседними сервисами |
| Radix, shadcn, Tailwind, lucide, sonner | `discard` | Не добавлять обратно: в tariff scope они не нужны |

`@sber-orm/ui-kit` не включён как локальный runtime bundle. Его импорты
externalized в `vite.config.ts`; это соответствует предоставленным сервисам.

После применения handoff-патча удалите бинарные артефакты прототипа отдельной
Git-операцией (они намеренно не вложены в текстовый patch-файл):

```powershell
git rm -r vendor src/assets public/favicon.ico bun.lockb
```

## 3. Подключение к root-config

1. Добавить собранный `tariff-mf-app.js` в import map под согласованным именем,
   например `@n-orm/tariff-mf-app`.
2. Зарегистрировать приложение для URL, содержащего `/tariff`.
3. Убедиться, что `@sber-orm/ui-kit`, `@sber-orm/components`, React,
   React DOM, React Router и auth microfrontend приходят из общего runtime.
4. Передать `STAND_TYPE`, `SBERNORM_CLICKSTREAM_KEY` и
   `SBERNORM_CLICKSTREAM_URL` в `window` по существующему механизму shell.
5. Не оборачивать сервис во второй локальный router. Внутренний
   `BrowserRouter` уже использует `baseUrl$.default`, как соседние сервисы.

Финальное имя приложения и порт при необходимости заменяются на значения,
принятые в root-config. Сейчас dev/preview port — `4411`.

## 4. UI Kit

Экран импортирует компоненты напрямую из `@sber-orm/ui-kit`; локальных
адаптеров и re-export нет. Перед merge продуктовая команда должна:

1. установить актуальные `@sber-orm/types__ui-kit`;
2. сверить их версию с UI Kit в import map;
3. выполнить `npm run lint:ts`;
4. при несовпадении API править конкретный вызов компонента, а не создавать
   копию UI Kit или универсальный facade.

В SCSS используются только semantic tokens UI Kit. Hex/rgb и локальная
палитра отсутствуют.

## 5. API вместо fixtures

`src/data/tariffFixtures.ts` — единственный временный источник предметных
данных. Он обеспечивает воспроизводимые состояния прототипа. При подключении
backend нужно:

1. сгенерировать или подключить принятый в целевом репозитории OpenAPI client;
2. заменить создание snapshot в `createInitialTariffStoreSnapshot` на загрузку
   тарифа и пользователей;
3. выполнить активацию/деактивацию через API actions;
4. сохранить проверку лимита на клиенте для быстрого feedback, но считать
   ответ backend окончательным;
5. добавить pending/error rollback для mutation actions;
6. получать `maxPaidUsers` из договора (`null` для безлимитного тарифа), а тарифицируемость пользователя
   вычислять по стабильным role ids, не по локализованному названию роли;
7. передавать весь каталог модулей с независимыми признаками
   `includedInContract` и `roleAvailable`;
8. оставить domain ids (`RoleId`, `UserStatus`, `ModuleId`) независимыми от i18n.

Тексты и состав модулей во fixtures перенесены из предоставленной сравнительной
таблицы тарифов. Текущий тариф прототипа — `Премиум`; перед production-интеграцией
контент нужно сверить с окончательной договорной документацией.

## 6. Маршруты и состояния

| Состояние | Временное воспроизведение |
|---|---|
| Базовый | `/tariff` |
| Премиум (безлимитный) | `/tariff?tariff=premium` |
| loading | `/tariff?scenario=loading` |
| refreshing | `/tariff?scenario=refreshing` |
| empty | `/tariff?scenario=empty` |
| тарифный лимит | `/tariff?scenario=limit` |
| read-only | `/tariff?permission=view` |
| provisioning pending | `/tariff?access=pending_provisioning` |
| access deactivated | `/tariff?access=deactivated` |
| recoverable failure | `/tariff?access=provisioning_failed` |
| платная активация ниже лимита | отключить активного тарифного пользователя, затем включить другого |
| активация нетарифицируемой роли без расходования слота | `?scenario=limit`, включить Марию Дмитриеву |
| поиск по отображаемой роли | раскрыть поиск и ввести `Аудитор` |
| описание тарифа | навести на карточку «Тариф» и открыть кнопку с шевроном |
| копирование email | навести на строку пользователя и нажать кнопку копирования |

Query-сценарии нужно удалить после подключения реального API и feature/demo
механизма продуктового окружения.

## 7. Перед merge

- получить точные package versions из целевого проекта/registry;
- выполнить `npm install`, закоммитить новый `package-lock.json`;
- подтвердить имя microfrontend и маршрут с владельцем root-config;
- подключить OpenAPI и права доступа;
- прогнать `lint`, `lint:ts`, `test`, `build` в корпоративной среде;
- проверить `/tariff` внутри shell на desktop и согласованном mobile viewport;
- проверить keyboard focus, modal focus trap и screen-reader labels.
