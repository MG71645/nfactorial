#!/bin/bash

echo "🔐 Генерация секретных ключей для Bailanysta"
echo "=============================================="
echo ""

# Генерируем JWT_SECRET
echo "JWT_SECRET:"
node -e "console.log(require('crypto').randomBytes(64).toString('hex'))"
echo ""

# Генерируем дополнительный секретный ключ
echo "API_SECRET:"
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
echo ""

# Генерируем ключ для шифрования
echo "ENCRYPTION_KEY:"
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
echo ""

echo "=============================================="
echo "💡 Скопируйте эти ключи в переменные окружения Vercel"
echo "⚠️  НЕ ДЕЛИТЕСЬ этими ключами и НЕ коммитьте их в Git!"
echo ""
echo "📋 Пример переменных окружения для Vercel:"
echo "JWT_SECRET=<скопированный_ключ>"
echo "API_SECRET=<скопированный_ключ>"
echo "ENCRYPTION_KEY=<скопированный_ключ>"
