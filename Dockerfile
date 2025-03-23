# Используем Node.js
FROM node:16-alpine

# Создаем директорию приложения
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем исходный код и статические файлы
COPY . .

# Открываем порт из переменной окружения (по умолчанию 3000)
EXPOSE ${PORT:-3000}

# Запускаем приложение
CMD ["node", "src/app.js"]