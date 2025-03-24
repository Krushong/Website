# Используем Node.js
FROM node:18-alpine

# Создаем директорию приложения
WORKDIR /app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код и статические файлы
COPY . .

# Установка переменных окружения по умолчанию
ENV PORT=3000
ENV GOOGLE_CLIENT_ID=""
ENV GOOGLE_CLIENT_SECRET=""
ENV YANDEX_CLIENT_ID=""
ENV YANDEX_CLIENT_SECRET=""

# Открываем порт
EXPOSE 3000

# Запускаем приложение
CMD ["node", "src/app.js"]