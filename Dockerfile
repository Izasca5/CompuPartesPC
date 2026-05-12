FROM node:22-alpine

# Directorio de trabajo
WORKDIR /app

# Copiamos archivos de dependencias
COPY package*.json ./

# Instalamos dependencias
RUN npm install

# Copiamos el resto del código del backend
COPY server.js .

# Exponemos el puerto del backend
EXPOSE 3000

# Comando para iniciar el backend
CMD ["node", "server.js"]
