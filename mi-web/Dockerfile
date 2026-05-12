# 1. Usa una imagen oficial como base
FROM node:22-alpine

# 2. Establece el directorio de trabajo dentro del contenedor
WORKDIR /app

# 3. Copia los archivos de dependencias
COPY package*.json ./

# 4. Instala las dependencias
RUN npm install

# 5. Copia el resto del código de tu proyecto
COPY . .

# 6. Expone el puerto que usa tu aplicación
EXPOSE 3000

# 7. Comando por defecto para iniciar la app
CMD ["npm", "run", "dev"]