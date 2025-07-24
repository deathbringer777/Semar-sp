# 🚀 Быстрое развертывание на GitHub Pages

## Способ 1: Автоматический (рекомендуется)

1. **Создайте репозиторий на GitHub**
   - Перейдите на [github.com](https://github.com)
   - Нажмите "New repository"
   - Назовите репозиторий (например: `job-dashboard`)
   - Оставьте его публичным
   - НЕ инициализируйте с README

2. **Загрузите файлы**
   - В новом репозитории нажмите "uploading an existing file"
   - Перетащите ВСЕ файлы из папки проекта
   - Нажмите "Commit changes"

3. **Настройте GitHub Pages**
   - Перейдите в Settings → Pages
   - В разделе Source выберите "Deploy from a branch"
   - Выберите Branch: `main` и папку `/ (root)`
   - Нажмите Save

4. **Готово!**
   - Ваш сайт будет доступен по адресу: `https://YOUR_USERNAME.github.io/job-dashboard`

## Способ 2: Через командную строку

```bash
# 1. Инициализируйте git
git init

# 2. Добавьте файлы
git add .

# 3. Создайте коммит
git commit -m "Initial commit"

# 4. Добавьте удаленный репозиторий (замените на ваш URL)
git remote add origin https://github.com/YOUR_USERNAME/job-dashboard.git

# 5. Отправьте код
git push -u origin main

# 6. Настройте GitHub Pages как описано выше
```

## Способ 3: Через скрипт

```bash
# Сделайте скрипт исполняемым (если еще не сделано)
chmod +x deploy.sh

# Запустите скрипт
./deploy.sh
```

## 🔧 Проверка работы

1. **Локально**: Откройте `test.html` в браузере для проверки API
2. **На GitHub Pages**: Перейдите по ссылке вашего сайта
3. **Проверьте консоль браузера** (F12) на наличие ошибок

## 🐛 Устранение проблем

### CORS ошибки
Если возникают проблемы с CORS, используйте CORS прокси:
```javascript
// В script.js замените API_URL на:
const API_URL = 'https://cors-anywhere.herokuapp.com/https://willi-work.emale.uno/job-matcher/all-data';
```

### Проблемы с отображением
1. Проверьте, что все файлы загружены в репозиторий
2. Убедитесь, что GitHub Pages включен
3. Подождите 5-10 минут после настройки Pages

## 📞 Поддержка

Если что-то не работает:
1. Проверьте консоль браузера (F12)
2. Убедитесь в доступности API
3. Проверьте настройки GitHub Pages

---

**Ваш дашборд готов к использованию! 🎉** 