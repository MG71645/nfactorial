# 🚀 Развертывание Bailanysta на Vercel

## 📋 Предварительные требования

1. **GitHub аккаунт** с репозиторием проекта
2. **Vercel аккаунт** (можно создать через GitHub)
3. **База данных** (рекомендуется PostgreSQL на Vercel или Supabase)

## 🔧 Подготовка проекта

### 1. Подготовка базы данных

Для production рекомендуется использовать PostgreSQL вместо SQLite:

```bash
# Установить PostgreSQL драйвер
cd backend
npm install pg @types/pg
```

### 2. Обновить переменные окружения

Создайте файл `.env.local` в корне проекта:

```env
# Backend Configuration
PORT=3001
NODE_ENV=production

# JWT Configuration (ИЗМЕНИТЕ ЭТО!)
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

# Database Configuration
DATABASE_URL=postgresql://username:password@host:port/database

# CORS Configuration
CORS_ORIGIN=https://your-domain.vercel.app
```

## 🌐 Развертывание на Vercel

### Шаг 1: Подключение репозитория

1. Зайдите на [vercel.com](https://vercel.com)
2. Нажмите "New Project"
3. Подключите ваш GitHub репозиторий
4. Выберите репозиторий `bailanysta`

### Шаг 2: Настройка проекта

В настройках проекта:

- **Framework Preset**: Other
- **Root Directory**: `./` (корень проекта)
- **Build Command**: `npm run build`
- **Output Directory**: `frontend/dist`
- **Install Command**: `npm run install:all`

### Шаг 3: Переменные окружения

Добавьте следующие переменные в Vercel:

```
NODE_ENV=production
JWT_SECRET=your-super-secret-jwt-key
DATABASE_URL=your-postgresql-connection-string
CORS_ORIGIN=https://your-domain.vercel.app
```

### Шаг 4: Деплой

1. Нажмите "Deploy"
2. Дождитесь завершения сборки
3. Проверьте работу приложения

## 🗄️ Настройка базы данных

### Вариант 1: Vercel Postgres

1. В Vercel Dashboard создайте новую базу данных
2. Скопируйте connection string
3. Добавьте в переменные окружения

### Вариант 2: Supabase (рекомендуется)

1. Зайдите на [supabase.com](https://supabase.com)
2. Создайте новый проект
3. Скопируйте connection string
4. Добавьте в переменные окружения

## 🔄 Обновление схемы БД

После настройки базы данных, обновите схему:

```sql
-- Создание таблиц (адаптировано для PostgreSQL)
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username VARCHAR(255) UNIQUE NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  avatar TEXT,
  bio TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE posts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  content TEXT NOT NULL,
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  author_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE likes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  post_id UUID REFERENCES posts(id) ON DELETE CASCADE,
  user_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(post_id, user_id)
);

CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  follower_id UUID REFERENCES users(id) ON DELETE CASCADE,
  following_id UUID REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(follower_id, following_id)
);
```

## 🧪 Тестирование после деплоя

1. **Регистрация**: Создайте нового пользователя
2. **Вход**: Войдите в систему
3. **Создание постов**: Создайте тестовый пост
4. **Лайки и комментарии**: Протестируйте взаимодействие

## 🚨 Возможные проблемы

### 1. CORS ошибки
- Проверьте `CORS_ORIGIN` в переменных окружения
- Убедитесь, что домен указан правильно

### 2. Ошибки базы данных
- Проверьте `DATABASE_URL`
- Убедитесь, что база данных доступна
- Проверьте права доступа

### 3. JWT ошибки
- Проверьте `JWT_SECRET`
- Убедитесь, что токен не истек

## 📱 Домены

После успешного деплоя вы получите:
- **Production URL**: `https://your-project.vercel.app`
- **Custom Domain**: Можно настроить в настройках проекта

## 🔄 Автоматические деплои

Vercel автоматически деплоит при каждом push в main ветку GitHub.

## 📞 Поддержка

При возникновении проблем:
1. Проверьте логи в Vercel Dashboard
2. Проверьте переменные окружения
3. Убедитесь, что база данных работает
4. Проверьте CORS настройки
