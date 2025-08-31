#!/bin/bash

echo "🗄️ Миграция Bailanysta с SQLite на Supabase"
echo "=============================================="
echo ""

# Проверяем, что Supabase CLI установлен
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI не установлен"
    echo "📦 Установите: https://supabase.com/docs/guides/cli"
    exit 1
fi

# Проверяем, что backend собран
echo "🔨 Проверяем backend..."
cd backend
if ! npx tsc --noEmit; then
    echo "❌ Backend не компилируется"
    exit 1
fi
cd ..

echo "✅ Backend готов"

# Проверяем, что frontend собирается
echo "🔨 Проверяем frontend..."
cd frontend
if ! npm run build; then
    echo "❌ Frontend не собирается"
    exit 1
fi
cd ..

echo "✅ Frontend готов"

echo ""
echo "📋 Следующие шаги для миграции:"
echo ""
echo "1. 🌐 Создайте проект на Supabase:"
echo "   - Зайдите на https://supabase.com"
echo "   - Создайте новый проект"
echo "   - Дождитесь завершения настройки"
echo ""
echo "2. 📝 Скопируйте connection string:"
echo "   - В настройках проекта → Database"
echo "   - Скопируйте 'Connection string'"
echo ""
echo "3. 🔧 Обновите переменные окружения в Vercel:"
echo "   - DATABASE_URL=<ваш_connection_string>"
echo "   - NODE_ENV=production"
echo ""
echo "4. 🗄️ Создайте таблицы в Supabase:"
echo "   - SQL Editor → New query"
echo "   - Вставьте содержимое файла supabase-schema.sql"
echo "   - Выполните запрос"
echo ""
echo "5. 🚀 Перезапустите приложение:"
echo "   - Vercel автоматически перезапустится"
echo "   - Проверьте логи на наличие ошибок"
echo ""
echo "📖 Подробная инструкция: https://supabase.com/docs/guides/database"
echo ""
echo "🎯 После миграции:"
echo "   - SQLite больше не будет использоваться"
echo "   - Все данные будут в PostgreSQL"
echo "   - Приложение станет масштабируемым"
