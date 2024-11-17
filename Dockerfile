# Используем базовый образ Node.js
FROM node:22

# Устанавливаем рабочую директорию
WORKDIR /usr/src/app

# Копируем package.json и package-lock.json
COPY package*.json ./

# Устанавливаем зависимости
RUN npm install

# Копируем остальной код
COPY . .

# Сборка приложения для production
RUN npm run build

# Используем nginx для сервировки статических файлов
FROM nginx:stable-alpine

# Копируем собранные файлы в nginx
COPY --from=0 /usr/src/app/dist /usr/share/nginx/html

# Копируем конфиг nginx, если требуется
# COPY nginx.conf /etc/nginx/conf.d/default.conf

# Указываем порт
EXPOSE 80

# Запуск nginx
CMD ["nginx", "-g", "daemon off;"]
