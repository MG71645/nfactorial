#!/bin/bash

echo "🚀 Подготовка к деплою Bailanysta на Vercel..."

# Проверяем, что Vercel CLI установлен
if ! command -v vercel &> /dev/null; then
    echo "❌ Vercel CLI не установлен. Устанавливаем..."
    npm install -g vercel
fi

# Проверяем, что все зависимости установлены
echo "📦 Устанавливаем зависимости..."
npm run install:all

# Собираем frontend
echo "🔨 Собираем frontend..."
cd frontend
npm run build
cd ..

# Проверяем, что сборка прошла успешно
if [ ! -d "frontend/dist" ]; then
    echo "❌ Ошибка сборки frontend"
    exit 1
fi

echo "✅ Frontend собран успешно"

# Проверяем, что backend компилируется
echo "🔨 Проверяем компиляцию backend..."
cd backend
npx tsc --noEmit
cd ..

if [ $? -ne 0 ]; then
    echo "❌ Ошибка компиляции backend"
    exit 1
fi

echo "✅ Backend компилируется без ошибок"

# Проверяем статус Git
if [ -z "$(git status --porcelain)" ]; then
    echo "✅ Git репозиторий чист"
else
    echo "⚠️  В Git репозитории есть несохраненные изменения"
    echo "   Рекомендуется закоммитить изменения перед деплоем"
    read -p "Продолжить деплой? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "❌ Деплой отменен"
        exit 1
    fi
fi

# Проверяем, что все файлы добавлены в Git
if ! git ls-files | grep -q "vercel.json"; then
    echo "⚠️  Файл vercel.json не добавлен в Git"
    echo "   Добавляем..."
    git add vercel.json
    git commit -m "Add Vercel configuration"
fi

# Запускаем деплой
echo "🚀 Запускаем деплой на Vercel..."
vercel --prod

echo "✅ Деплой завершен!"
echo "🌐 Проверьте ваше приложение по ссылке выше"
echo ""
echo "📋 Следующие шаги:"
echo "1. Настройте переменные окружения в Vercel Dashboard"
echo "2. Подключите базу данных (PostgreSQL)"
echo "3. Обновите CORS_ORIGIN в переменных окружения"
echo "4. Протестируйте приложение"
