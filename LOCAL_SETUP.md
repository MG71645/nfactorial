# 🔧 Настройка локального окружения для Bailanysta

## 📋 Предварительные требования

- ✅ Node.js 18+ установлен
- ✅ Git репозиторий склонирован
- ✅ Зависимости установлены (`npm run install:all`)

## 🌍 Настройка переменных окружения

### Шаг 1: Создайте файл `.env.local`

В корне проекта создайте файл `.env.local` (он уже в .gitignore):

```bash
# 🌍 Локальные переменные окружения для разработки

# ===== BACKEND НАСТРОЙКИ =====
NODE_ENV=development
PORT=3001

# ===== JWT НАСТРОЙКИ =====
# Для разработки используем простой ключ
JWT_SECRET=dev-secret-key-change-in-production

# ===== БАЗА ДАННЫХ =====
# Для локальной разработки используем SQLite
DATABASE_URL=sqlite://./backend/database/bailanysta.db

# ===== CORS НАСТРОЙКИ =====
# Разрешаем локальные домены для разработки
CORS_ORIGIN=http://localhost:5173

# ===== ДОПОЛНИТЕЛЬНЫЕ НАСТРОЙКИ =====
LOG_LEVEL=debug
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

### Шаг 2: Инициализируйте базу данных

```bash
cd backend
npm run db:init
cd ..
```

## 🚀 Запуск локальной разработки

### Вариант 1: Быстрый старт (рекомендуется)

```bash
# Запуск всех сервисов
./start.sh
```

### Вариант 2: Ручной запуск

#### Terminal 1: Backend
```bash
cd backend
npm run dev
```

#### Terminal 2: Frontend
```bash
cd frontend
npm run dev
```

## 🌐 Доступ к приложению

- **Frontend**: http://localhost:5173
- **Backend API**: http://localhost:3001
- **Health Check**: http://localhost:3001/health

## 🗄️ База данных

### Локальная разработка
- **Тип**: SQLite
- **Файл**: `backend/database/bailanysta.db`
- **Автоматически**: создается при `npm run db:init`

### Production (Supabase)
- **Тип**: PostgreSQL
- **Автоматически**: переключается при `NODE_ENV=production`

## 🔧 Конфигурация

### Переменные окружения

| Переменная | Значение | Описание |
|------------|----------|----------|
| `NODE_ENV` | `development` | Режим разработки |
| `PORT` | `3001` | Порт backend сервера |
| `JWT_SECRET` | `dev-secret-key...` | Ключ для JWT токенов |
| `DATABASE_URL` | `sqlite://...` | URL базы данных |
| `CORS_ORIGIN` | `http://localhost:5173` | Разрешенный origin |
| `LOG_LEVEL` | `debug` | Уровень логирования |

### Автоматическое переключение

Приложение автоматически выбирает базу данных:

- **`NODE_ENV=development`** → SQLite (локальная разработка)
- **`NODE_ENV=production`** + `DATABASE_URL=postgresql://...` → PostgreSQL (Supabase)

## 🧪 Тестирование локального окружения

### 1. Проверьте backend
```bash
curl http://localhost:3001/health
```

Ожидаемый ответ:
```json
{"status":"OK","timestamp":"2025-08-31T..."}
```

### 2. Проверьте frontend
Откройте http://localhost:5173 в браузере

### 3. Протестируйте API
```bash
# Регистрация
curl -X POST http://localhost:3001/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'

# Получение постов
curl http://localhost:3001/api/posts
```

## 🚨 Возможные проблемы

### 1. Порт 3001 занят
```bash
# Найдите процесс, использующий порт
lsof -ti:3001

# Остановите процесс
kill -9 <PID>
```

### 2. База данных не инициализирована
```bash
cd backend
npm run db:init
cd ..
```

### 3. Переменные окружения не загружаются
- Убедитесь, что файл `.env.local` создан в корне проекта
- Проверьте, что `dotenv` установлен в backend
- Перезапустите backend сервер

### 4. CORS ошибки
- Проверьте `CORS_ORIGIN` в `.env.local`
- Убедитесь, что frontend запущен на порту 5173

## 🔄 Переключение между режимами

### Для локальной разработки
```bash
# .env.local
NODE_ENV=development
DATABASE_URL=sqlite://./backend/database/bailanysta.db
```

### Для production (Supabase)
```bash
# .env.local
NODE_ENV=production
DATABASE_URL=postgresql://postgres:password@db.ref.supabase.co:5432/postgres
```

## 📚 Полезные команды

```bash
# Проверка TypeScript
cd backend && npx tsc --noEmit

# Сборка frontend
cd frontend && npm run build

# Очистка процессов
pkill -f tsx && pkill -f vite

# Проверка портов
lsof -i :3001
lsof -i :5173
```

## 🎯 Готово!

После настройки `.env.local` и инициализации базы данных:

1. ✅ Backend будет использовать SQLite локально
2. ✅ Frontend будет доступен на localhost:5173
3. ✅ API будет работать на localhost:3001
4. ✅ Автоматическое переключение на Supabase в production

Теперь вы можете разрабатывать локально! 🚀
