# Stage 1: Build la aplicación (usando node:18-alpine)
FROM node:18-alpine AS build

WORKDIR /app

# Copiar package.json y package-lock.json (o yarn.lock)
COPY package*.json ./

# Instalar dependencias
RUN npm install

# Copiar todo el código y construir la app
COPY . .
RUN npm run build

# Stage 2: Servir la aplicación con Nginx
FROM nginx:stable-alpine

# Copiar el archivo nginx.conf personalizado
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copiar la carpeta generada por el build a la carpeta de Nginx
COPY --from=build /app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
