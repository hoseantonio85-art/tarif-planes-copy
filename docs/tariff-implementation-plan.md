# План реализации страницы тарифа

## 1. Scope и target-first контракт

Маршрут `/tariff` и весь его runtime работают на `@sber-orm/ui-kit`, SCSS Modules, дизайн-токенах и namespace `tariff`. Существующая главная страница сохраняется как отдельный lazy-loaded legacy-маршрут и не попадает в runtime-чанк тарифа. Блоки `LOVABLE_KEEP`, basename и общая ширина контента сохранены.

## 2. Dependency decisions

| Зависимость | Решение | Обоснование |
|---|---|---|
| `@sber-orm/ui-kit@0.283.0` | target-provided | Целевая зависимость экрана; временно подключён неизменённый `dist`, пока Nexus недоступен |
| `SBSansText` | reuse | Файлы шрифта взяты из локального пакета UI Kit и зарегистрированы глобально |
| shadcn/Radix/Sonner | discard для `/tariff` | Загружаются только внутри lazy legacy-маршрута `/` |
| Tailwind | discard для `/tariff` | CSS вынесен в отдельный legacy-чанк; глобальная палитра удалена |
| `lucide-react` | discard для `/tariff` | Sidebar тарифа использует `Icon` из UI Kit |
| React Router | reuse | Существующий basename и `LOVABLE_KEEP` сохранены |

## 3. Component tree

```text
TariffInfo
├─ SystemLoadingState
├─ SystemAccessState (access != active, без sidebar)
└─ TariffSidebar + TariffWorkspace
   ├─ TariffOverview
   │  ├─ Summary cards
   │  ├─ Contract company Chips
   │  └─ Module Chips → ModulePopover
   └─ UsersSection
      ├─ UsersToolbar → Search + FilterPopover
      ├─ Limit Alert
      ├─ UsersList → hover email + copy Notification + Switch
      └─ UserAccessModal
```

## 4. State ownership и stable ids

`useTariffModel` владеет пользователями, поиском, draft/applied filters, modal, feedback и воспроизводимыми query-сценариями. Чистые преобразования находятся в `src/helpers/tariff.ts` и покрыты тестами. Фильтры ролей используют только `RoleId`; локализованные названия ролей преобразуются в стабильные `RoleId` на presentation boundary. Полнотекстовый поиск работает по ФИО, email и отображаемой роли.

Тарифный слот занимает пользователь со `status: active` и `inTariff: true`;
отображаемая роль не участвует в подсчёте. Превышение лимита показывается
закрываемым `Alert`, успешная активация — верхним `Notification`. Эти решения
фиксируют последние согласованные продуктовые уточнения.

## 5. UI Kit map

| Элемент | Компонент UI Kit |
|---|---|
| Layout и типографика | `Row`, `Col`, `Title`, `Text` |
| Sidebar и действия | `Button`, `Icon`, `Badge` |
| Компании и модули | `Chips` |
| Быстрые фильтры и поиск | `RadioChips`, `FieldSearch` |
| Фильтры и модули | `Popover`, `Switch` |
| Подтверждение деактивации | `Modal`, `ModalHeader`, `ModalBody`, `ModalFooter` |
| Feedback | `Notification`, `Alert` |
| Загрузка | `Loader` |

## 6. Scenario matrix

| Сценарий | Воспроизведение | Ожидание |
|---|---|---|
| Default | `/tariff` | Все блоки и активные действия |
| Loading | `?scenario=loading` | Полноэкранная загрузка без sidebar |
| Refreshing | `?scenario=refreshing` | Данные остаются видимыми, показан информационный Alert |
| Empty | `?scenario=empty` | Список сообщает, что пользователи не найдены |
| Limit reached | `?scenario=limit` | Активация блокируется Alert под фильтрами |
| View-only | `?permission=view` | Switch disabled |
| Paid activation | Отключить активного тарифного пользователя, затем включить другого | Счётчик уменьшается и возвращается к лимиту, показывается Notification |
| Guest activation | `?scenario=limit`, включить Дмитрия Лебедева | Пользователь включается, счётчик тарифа не меняется |
| Role search | Раскрыть поиск и ввести `Аудитор` | Найдены пользователи с ролью `ORMCLOUD_AUDITOR` |
| Pending provisioning | `?access=pending_provisioning` | Полноэкранное состояние без sidebar |
| Deactivated | `?access=deactivated` | Полноэкранное состояние без sidebar |
| Provisioning failed | `?access=provisioning_failed` | Recoverable error и retry |
| Module unavailable | default fixture | Пояснение в Popover, переход disabled |

## 7. Definition of Done

- [x] Активный маршрут не импортирует shadcn/Radix/Tailwind/lucide.
- [x] Sidebar тарифа собран на UI Kit, SCSS Modules и i18n.
- [x] В активном scope нет hardcoded colors и локальной палитры.
- [x] `SBSansText` зарегистрирован для regular/semibold/bold.
- [x] Stable ids отделены от локализованных labels.
- [x] Loading/refreshing/empty/error/disabled/modal/limit доступны воспроизводимо.
- [x] Helpers покрыты тестами.
- [x] TypeScript, тесты, ESLint, production build и runtime-проверки проходят.
- [ ] Заменить временный vendor fallback на Nexus-зависимость после восстановления корпоративного доступа.

## 8. Инфраструктурное ограничение

Корпоративный Nexus отклоняет DNS-запросы из текущей среды. Поэтому единственное незакрытое отклонение — способ поставки `@sber-orm/ui-kit@0.283.0`. Код импортирует публичный package id и CSS export, но Vite временно разрешает их на локальный неизменённый пакет. После появления доступа нужно установить официальную зависимость и удалить два vendor alias из `vite.config.ts`.
