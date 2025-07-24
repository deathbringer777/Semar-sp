#!/bin/bash

# Скрипт для развертывания на GitHub Pages
echo "🚀 Начинаем развертывание на GitHub Pages..."

# Проверяем, инициализирован ли git
if [ ! -d ".git" ]; then
    echo "📁 Инициализируем git репозиторий..."
    git init
fi

# Добавляем все файлы
echo "📦 Добавляем файлы в git..."
git add .

# Создаем коммит
echo "💾 Создаем коммит..."
git commit -m "Update job dashboard - $(date)"

# Проверяем, есть ли удаленный репозиторий
if ! git remote get-url origin > /dev/null 2>&1; then
    echo "⚠️  Удаленный репозиторий не настроен!"
    echo "📝 Пожалуйста, выполните следующие команды:"
    echo ""
    echo "1. Создайте репозиторий на GitHub.com"
    echo "2. Выполните команду:"
    echo "   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git"
    echo "3. Затем запустите этот скрипт снова"
    echo ""
    exit 1
fi

# Отправляем изменения
echo "⬆️  Отправляем изменения на GitHub..."
git push origin main

echo ""
echo "✅ Развертывание завершено!"
echo ""
echo "📋 Следующие шаги для настройки GitHub Pages:"
echo "1. Перейдите в ваш репозиторий на GitHub.com"
echo "2. Нажмите Settings → Pages"
echo "3. В разделе Source выберите 'Deploy from a branch'"
echo "4. Выберите Branch: main и папку / (root)"
echo "5. Нажмите Save"
echo ""
echo "🌐 Ваш сайт будет доступен по адресу:"
echo "   https://YOUR_USERNAME.github.io/YOUR_REPO_NAME"
echo "" 