#!/bin/bash

echo "🔍 Проверка статуса миграции Bailanysta на Supabase"
echo "=================================================="
echo ""

# Проверяем локальные переменные окружения
if [ -f ".env.local" ]; then
    echo "✅ Файл .env.local найден"
    echo "📋 Содержимое:"
    cat .env.local | grep -E "(NODE_ENV|DATABASE_URL|JWT_SECRET)" || echo "   Переменные не найдены"
else
    echo "❌ Файл .env.local не найден"
fi

echo ""

# Проверяем, что backend компилируется
echo "🔨 Проверяем backend..."
cd backend
if npx tsc --noEmit; then
    echo "✅ Backend компилируется без ошибок"
else
    echo "❌ Ошибки компиляции backend"
    exit 1
fi
cd ..

echo ""

# Проверяем, что frontend собирается
echo "🔨 Проверяем frontend..."
cd frontend
if npm run build; then
    echo "✅ Frontend собирается без ошибок"
else
    echo "❌ Ошибки сборки frontend"
    exit 1
fi
cd ..

echo ""
echo "=================================================="
echo "📋 Следующие шаги для миграции на Supabase:"
echo ""
echo "1. 🌐 Создайте проект на Supabase:"
echo "   - https://supabase.com → New Project"
echo "   - Название: bailanysta"
echo "   - Дождитесь завершения настройки"
echo ""
echo "2. 🗄️ Создайте таблицы:"
echo "   - SQL Editor → New query"
echo "   - Вставьте содержимое supabase-schema.sql"
echo "   - Выполните запрос"
echo ""
echo "3. 🔑 Получите connection string:"
echo "   - Settings → Database → Connection string"
echo "   - Скопируйте URI формат"
echo "   - Замените [YOUR-PASSWORD] на ваш пароль"
echo ""
echo "4. ⚙️ Обновите переменные в Vercel:"
echo "   - NODE_ENV=production"
echo "   - DATABASE_URL=postgresql://postgres:YOUR_PASSWORD@db.PROJECT_REF.supabase.co:5432/postgres"
echo "   - JWT_SECRET=ваш_ключ_из_generate-secrets.sh"
echo "   - CORS_ORIGIN=https://nfactorial-a057ek1lp-mg71645s-projects.vercel.app"
echo ""
echo "5. 🚀 Перезапустите приложение:"
echo "   - Vercel автоматически перезапустится"
echo "   - Проверьте логи на наличие ошибок"
echo ""
echo "📖 Подробная инструкция: SUPABASE_SETUP.md"
echo "🔧 Скрипт миграции: migrate-to-supabase.sh"
