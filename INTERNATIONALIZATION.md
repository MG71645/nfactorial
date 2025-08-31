# 🌍 Многоязычность Bailanysta

## 📋 Обзор

Bailanysta поддерживает три языка:
- **🇺🇸 English** - основной язык (по умолчанию)
- **🇰🇿 Қазақша** - казахский язык
- **🇷🇺 Русский** - русский язык

## 🏗️ Архитектура

### **Структура файлов:**
```
frontend/src/locales/
├── index.ts          # Основной экспорт и функции
├── en.ts             # Английские переводы
├── kk.ts             # Казахские переводы
└── ru.ts             # Русские переводы
```

### **Контексты:**
- **`LanguageContext`** - управление языком интерфейса
- **`ThemeContext`** - управление темой
- **`AuthContext`** - управление аутентификацией

## 🔧 Использование

### **1. В компонентах:**

```tsx
import { useLanguage } from '../contexts/LanguageContext';

const MyComponent = () => {
  const { t, language, setLanguage } = useLanguage();
  
  return (
    <div>
      <h1>{t('home.hero.title')}</h1>
      <p>Current language: {language}</p>
      <button onClick={() => setLanguage('kk')}>
        Switch to Kazakh
      </button>
    </div>
  );
};
```

### **2. Функция перевода `t()`:**

```tsx
// Простой перевод
t('nav.home') // → "Home" / "Басты бет" / "Главная"

// С плюрализацией
t('time.minutesAgo', 5) // → "5 minutes ago" / "5 минут бұрын" / "5 минут назад"

// Вложенные ключи
t('auth.loginButton') // → "Sign In" / "Кіру" / "Войти"
```

### **3. Переключение языка:**

```tsx
const { setLanguage } = useLanguage();

// Переключение на конкретный язык
setLanguage('kk'); // Казахский
setLanguage('ru'); // Русский
setLanguage('en'); // Английский
```

## 📝 Структура переводов

### **Навигация:**
```tsx
nav: {
  home: 'Home',
  profile: 'Profile',
  login: 'Login',
  register: 'Register',
  logout: 'Logout',
  language: 'Language'
}
```

### **Аутентификация:**
```tsx
auth: {
  login: 'Login',
  register: 'Register',
  email: 'Email',
  password: 'Password',
  // ... и т.д.
}
```

### **Посты:**
```tsx
posts: {
  createPost: 'Create Post',
  postPlaceholder: "What's on your mind?",
  like: 'Like',
  likes: 'Likes',
  // ... и т.д.
}
```

### **Время:**
```tsx
time: {
  now: 'Just now',
  minutesAgo: '{{count}} minute ago',
  minutesAgo_plural: '{{count}} minutes ago',
  // ... и т.д.
}
```

## 🌐 Автоматическое определение языка

### **Приоритет выбора языка:**

1. **Сохраненный выбор** - язык, выбранный пользователем ранее
2. **Язык браузера** - автоматическое определение по настройкам браузера
3. **Английский** - язык по умолчанию

### **Поддерживаемые коды языков:**
- `en` - English
- `kk` - Қазақша (казахский)
- `ru` - Русский (русский)

## 🔄 Добавление нового языка

### **1. Создайте файл перевода:**

```tsx
// frontend/src/locales/de.ts
export const de = {
  nav: {
    home: 'Startseite',
    profile: 'Profil',
    // ... и т.д.
  },
  // ... остальные переводы
};
```

### **2. Обновите индексный файл:**

```tsx
// frontend/src/locales/index.ts
import { de } from './de';

export type Language = 'en' | 'kk' | 'ru' | 'de';

export const languages = {
  en,
  kk,
  ru,
  de, // Добавьте новый язык
} as const;
```

### **3. Обновите LanguageContext:**

```tsx
// frontend/src/contexts/LanguageContext.tsx
const getDefaultLanguage = (): Language => {
  // ... существующая логика ...
  
  // Добавьте поддержку немецкого
  if (browserLang.startsWith('de')) {
    return 'de';
  }
  
  return 'en';
};
```

## 🎨 Компонент LanguageSwitcher

### **Особенности:**
- **Dropdown меню** с флагами стран
- **Анимации** с помощью Framer Motion
- **Автоматическое закрытие** при клике вне компонента
- **Подсветка текущего языка**

### **Использование:**
```tsx
import LanguageSwitcher from '../components/LanguageSwitcher';

// В Layout.tsx
<div className="flex items-center space-x-4">
  <LanguageSwitcher />
  <ThemeToggle />
  {/* ... */}
</div>
```

## 💾 Сохранение настроек

### **Local Storage:**
- **`language`** - выбранный язык пользователя
- **`theme`** - выбранная тема
- **`token`** - JWT токен аутентификации
- **`user`** - данные пользователя

### **Автоматическое восстановление:**
При загрузке приложения автоматически восстанавливаются:
- Выбранный язык
- Тема оформления
- Состояние аутентификации

## 🚀 Производительность

### **Оптимизации:**
- **Ленивая загрузка** переводов
- **Кэширование** в Local Storage
- **Fallback** на английский при отсутствии перевода
- **Tree-shaking** неиспользуемых переводов

### **Размер бандла:**
- **Английский**: базовый размер
- **Казахский**: +~2KB
- **Русский**: +~2KB

## 🧪 Тестирование

### **Проверка переводов:**
```tsx
// В компоненте
const { t, language } = useLanguage();

// Проверьте, что переводы работают
console.log('Current language:', language);
console.log('Translation:', t('nav.home'));
```

### **Переключение языков:**
1. Откройте приложение
2. Нажмите на переключатель языка
3. Выберите другой язык
4. Проверьте, что интерфейс обновился

## 📱 Адаптивность

### **Поддержка RTL:**
- **Казахский**: LTR (слева направо)
- **Русский**: LTR (слева направо)
- **Английский**: LTR (слева направо)

### **Мобильные устройства:**
- **Touch-friendly** переключатель языка
- **Responsive** dropdown меню
- **Оптимизированные** анимации

## 🔮 Планы на будущее

- [ ] **Автоматический перевод** с помощью AI API
- [ ] **Локализация дат** и чисел
- [ ] **Поддержка RTL** языков (арабский, иврит)
- [ ] **Грамматические формы** для сложных языков
- [ **Интеграция с i18next** для продвинутых возможностей

## 📞 Поддержка

При возникновении проблем с переводами:
1. Проверьте, что файл перевода создан
2. Убедитесь, что ключи совпадают
3. Проверьте консоль на наличие ошибок
4. Убедитесь, что LanguageProvider обернут вокруг приложения

---

**Многоязычность делает Bailanysta доступной для пользователей по всему миру! 🌍✨**
