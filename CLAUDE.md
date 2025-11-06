# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

B5 MM (Mobile/Marketing) - минималистичное SPA приложение для публичной отправки проектов в систему Bonus5 по секретному ключу. Построено на SvelteKit 2 + Svelte 5 с использованием Tailwind CSS 4.

**Назначение**: Позволяет партнерам и клиентам отправлять проекты в систему без регистрации/аутентификации, используя только секретный ULID ключ.

## Commands

### Development
```bash
npm run dev              # Запуск dev сервера
npm run dev -- --open    # Запуск с автоматическим открытием браузера
```

### Build & Preview
```bash
npm run build            # Production сборка
npm run preview          # Предварительный просмотр production сборки
```

### Linting & Formatting
```bash
npm run lint             # Проверка форматирования (prettier)
npm run format           # Форматирование кода (prettier)
```

## Architecture

### Application Structure

Минималистичное приложение с одной страницей:
- `src/routes/+page.svelte` - единственная страница с формой отправки проекта
- `src/routes/+layout.svelte` - базовый layout
- `src/lib/api/projects.js` - API функция для публичной отправки проектов
- `src/lib/` - shared utilities и компоненты

### Key Features

1. **Secret Key Validation**:
   - Использует ULID формат (26 символов: 0-9, A-H, J-K, M-N, P-T, V-Z)
   - Валидация через regex: `/^[0-9A-HJKMNP-TV-Z]{26}$/`
   - Автоматическое преобразование в uppercase
   - Маскирование ключа (показываются только последние 4 символа)

2. **Form Submission**:
   - Отправка на REST API endpoint: `POST /api/projects/public-submit`
   - Коммуникация с b5-api-2 сервером
   - Rate limiting: 10 запросов в минуту

3. **Security**:
   - Секретный ключ маскируется во время ввода (показываются только последние 4 символа)
   - Размаскировка только при фокусе на input
   - ULID ключи генерируются на backend и передаются партнерам

### State Management

Использует **Svelte 5 runes**:
- `$state()` - для reactive state (loading, messages, secretKeyInput)
- `$derived()` - для computed значений (displayValue с маскированием)

Пример из `+page.svelte`:
```javascript
let secretKeyInput = $state('');
let isKeyFocused = $state(false);
let displayValue = $derived(isKeyFocused ? secretKeyInput : maskSecretKey(secretKeyInput));
```

### Environment Configuration

`.env.development` и `.env.production`:
```
VITE_API_BASE_URL=http://localhost:8000    # b5-api-2 URL
```

### API Integration

`src/lib/api/projects.js`:
- `publicSubmit()` - отправка проекта по секретному ключу
- Endpoint: `POST ${API_BASE_URL}/api/projects/public-submit`
- Payload: `{ secret_key: string }`

### UI Styling

Использует Tailwind CSS 4 с минималистичным дизайном:
- Центрированная форма на весь экран
- Фокус на UX для ввода секретного ключа
- Responsive дизайн

## Key Technologies

- **SvelteKit 2** - фреймворк с SSR
- **Svelte 5** - использует новые runes ($state, $derived)
- **Tailwind CSS 4** - utility-first CSS
- **ULID** - для генерации/валидации секретных ключей
- **Adapter Node** - для production деплоя

## Docker

Production deployment:
- `Dockerfile.production` - Docker image configuration
- `entrypoint.sh` - Docker entrypoint script

## Documentation

- `SECRET_KEY_MASKING.md` - документация по маскированию секретных ключей
- `FORM_PADDING_UPDATE.md` - обновления padding в форме

## Development Workflow

1. Изменяйте страницу в `src/routes/+page.svelte`
2. Добавляйте/изменяйте API функции в `src/lib/api/`
3. Тестируйте с реальным ULID ключом из системы
4. Проверяйте маскирование и валидацию ключа

## Integration with Backend

Приложение взаимодействует с **b5-api-2**:
- Endpoint: `POST /api/projects/public-submit`
- Rate limit: 10 запросов в минуту
- Требуется валидный ULID секретный ключ

## Important Notes

- Это **публичное приложение без аутентификации**
- Вся безопасность построена на секретном ULID ключе
- Ключи должны быть уникальными и генерироваться на backend
- Приложение предназначено для мобильных устройств и маркетинговых кампаний
