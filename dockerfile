# ---- Etapa 1: Construcción ----
    FROM node:20 AS builder
    WORKDIR /app
    
    # Copiar package.json e instalar todas las dependencias
    COPY package.json package-lock.json ./
    RUN npm install
    
    # Copiar el resto del código
    COPY . .
    
    # Compilar el código
    RUN npm run build
    
    # ---- Etapa 2: Producción ----
    FROM node:20 AS production
    WORKDIR /app
    
    # Copiar solo lo necesario desde la etapa de construcción
    COPY package.json package-lock.json ./
    RUN npm install --only=production
    COPY --from=builder /app/dist ./dist
    
    # Exponer el puerto y ejecutar la aplicación
    EXPOSE 3000
    CMD ["npm", "run", "start:prod"]
    