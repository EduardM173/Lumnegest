# Usa una imagen base de Node.js
FROM node:18-alpine

# Establece el directorio de trabajo
WORKDIR /app

# Copia package.json y package-lock.json (si existe)
COPY package*.json ./

# Instala las dependencias
RUN npm install

# Copia el resto del código
COPY . .

# Genera el Prisma Client y aplica migraciones si lo deseas (esto es opcional en el Dockerfile, o se ejecuta externamente)
RUN npx prisma generate


# Expone el puerto del backend
EXPOSE 3001

# Comando para iniciar el servidor en modo producción
#CMD ["npm", "run", "dev"]
CMD ["sh", "-c", "npx prisma migrate deploy && npm start"]

