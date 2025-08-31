# 🗄️ Настройка Supabase для Bailanysta

## 🌐 Создание проекта на Supabase

### Шаг 1: Регистрация
1. Зайдите на [supabase.com](https://supabase.com)
2. Нажмите "Start your project"
3. Войдите через GitHub

### Шаг 2: Создание проекта
1. Нажмите "New Project"
2. Выберите организацию
3. Введите название: `bailanysta`
4. Введите пароль для базы данных (запомните его!)
5. Выберите регион (ближайший к вашим пользователям)
6. Нажмите "Create new project"

### Шаг 3: Ожидание настройки
- Дождитесь завершения настройки (5-10 минут)
- Статус должен стать "Online"

## 🔑 Получение connection string

### Шаг 1: Откройте настройки проекта
1. В Supabase Dashboard выберите ваш проект
2. Перейдите в **Settings** → **Database**

### Шаг 2: Скопируйте connection string
1. Найдите раздел "Connection string"
2. Выберите "URI" формат
3. Скопируйте строку, которая выглядит так:
   ```
   postgresql://postgres:[YOUR-PASSWORD]@db.[PROJECT-REF].supabase.co:5432/postgres
   ```

### Шаг 3: Замените пароль
Замените `[YOUR-PASSWORD]` на пароль, который вы указали при создании проекта.

## 🗄️ Создание таблиц

### Шаг 1: Откройте SQL Editor
1. В Supabase Dashboard перейдите в **SQL Editor**
2. Нажмите "New query"

### Шаг 2: Вставьте схему
1. Скопируйте содержимое файла `supabase-schema.sql`
2. Вставьте в SQL Editor
3. Нажмите "Run" (▶️)

### Шаг 3: Проверьте результат
Должны создаться:
- ✅ Таблица `users`
- ✅ Таблица `posts`
- ✅ Таблица `comments`
- ✅ Таблица `likes`
- ✅ Таблица `subscriptions`
- ✅ Индексы и триггеры
- ✅ Политики безопасности (RLS)

## 🔧 Настройка переменных окружения в Vercel

### Шаг 1: Откройте Vercel Dashboard
1. Зайдите на [vercel.com](https://vercel.com)
2. Выберите проект `nfactorial`

### Шаг 2: Добавьте переменные
Перейдите в **Settings** → **Environment Variables** и добавьте:

| Name | Value | Environment |
|------|-------|-------------|
| `DATABASE_URL` | `postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres` | Production |
| `NODE_ENV` | `production` | Production |
| `JWT_SECRET` | `ваш_сгенерированный_ключ` | Production |
| `CORS_ORIGIN` | `https://nfactorial-a057ek1lp-mg71645s-projects.vercel.app` | Production |

### Шаг 3: Перезапуск
Vercel автоматически перезапустит приложение с новыми переменными.

## 🧪 Тестирование миграции

### Шаг 1: Проверьте логи
1. В Vercel Dashboard перейдите в **Functions**
2. Найдите backend функцию
3. Проверьте логи на наличие ошибок

### Шаг 2: Протестируйте API
```bash
# Проверьте health endpoint
curl https://nfactorial-a057ek1lp-mg71645s-projects.vercel.app/api/health

# Попробуйте зарегистрироваться
curl -X POST https://nfactorial-a057ek1lp-mg71645s-projects.vercel.app/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"username": "testuser", "email": "test@example.com", "password": "password123"}'
```

### Шаг 3: Проверьте базу данных
1. В Supabase Dashboard перейдите в **Table Editor**
2. Проверьте, что таблицы созданы
3. Посмотрите, что данные записываются

## 🚨 Возможные проблемы

### 1. Ошибка подключения к базе данных
- Проверьте `DATABASE_URL`
- Убедитесь, что пароль правильный
- Проверьте, что проект активен

### 2. Ошибки RLS (Row Level Security)
- Убедитесь, что политики безопасности созданы
- Проверьте, что `auth.uid()` работает

### 3. Ошибки SSL
- В production SSL должен быть включен
- Проверьте настройки SSL в коде

## 📊 Мониторинг

### Supabase Dashboard
- **Database**: статистика запросов
- **Logs**: логи запросов
- **API**: использование API

### Vercel Dashboard
- **Functions**: логи backend
- **Analytics**: производительность
- **Deployments**: история деплоев

## 🔄 Откат к SQLite

Если что-то пойдет не так, вы можете временно вернуться к SQLite:

1. В Vercel измените `NODE_ENV` на `development`
2. Удалите `DATABASE_URL`
3. Приложение будет использовать локальную SQLite базу

## 🎯 Преимущества Supabase

- ✅ **Масштабируемость**: PostgreSQL вместо SQLite
- ✅ **Безопасность**: RLS и политики безопасности
- ✅ **Производительность**: индексы и оптимизация
- ✅ **Мониторинг**: встроенные инструменты
- ✅ **Backup**: автоматическое резервное копирование
- ✅ **SSL**: безопасные соединения

## 📞 Поддержка

- **Supabase Docs**: [supabase.com/docs](https://supabase.com/docs)
- **Supabase Discord**: [discord.supabase.com](https://discord.supabase.com)
- **Vercel Docs**: [vercel.com/docs](https://vercel.com/docs)
