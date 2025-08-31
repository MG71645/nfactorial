# 🚀 Быстрый деплой Bailanysta на Vercel

## ⚡ 5 минут до production

### 1. Подготовка (1 минута)
```bash
# Убедитесь, что все изменения закоммичены
git add .
git commit -m "Prepare for Vercel deployment"
```

### 2. Установка Vercel CLI (1 минута)
```bash
npm install -g vercel
```

### 3. Деплой (2 минуты)
```bash
# Автоматический деплой
./deploy.sh

# ИЛИ ручной деплой
vercel --prod
```

### 4. Настройка переменных (1 минута)
В Vercel Dashboard добавьте:
- `JWT_SECRET` = `your-super-secret-key`
- `DATABASE_URL` = `your-postgresql-url`
- `CORS_ORIGIN` = `https://your-domain.vercel.app`

### 5. Готово! 🎉

Ваше приложение доступно по адресу: `https://your-project.vercel.app`

## 🔧 Что происходит автоматически

- ✅ Сборка frontend
- ✅ Проверка backend
- ✅ Деплой на Vercel
- ✅ Настройка маршрутов

## 📱 Следующие шаги

1. **Подключите базу данных** (Supabase или Vercel Postgres)
2. **Настройте custom domain** (опционально)
3. **Протестируйте приложение**
4. **Поделитесь ссылкой!**

## 🆘 Если что-то пошло не так

1. Проверьте логи в Vercel Dashboard
2. Убедитесь, что все переменные окружения настроены
3. Проверьте, что база данных доступна
4. Запустите `./deploy.sh` снова

---

**Подробная инструкция:** [DEPLOYMENT.md](./DEPLOYMENT.md)
