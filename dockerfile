FROM node:18-slim

# 1. Installer les dépendances système pour Chromium
RUN apt-get update && apt-get install -y \
    ca-certificates fonts-liberation libappindicator3-1 libasound2 \
    libatk-bridge2.0-0 libatk1.0-0 libcups2 libdbus-1-3 libgdk-pixbuf2.0-0 \
    libnspr4 libnss3 libx11-xcb1 libxcomposite1 libxdamage1 libxrandr2 \
    xdg-utils libgbm-dev libxshmfence-dev chromium

# 2. Créer le répertoire de travail et copier ton code
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .

# 3. Indiquer à Puppeteer d’utiliser Chromium système
ENV PUPPETEER_SKIP_CHROMIUM_DOWNLOAD=true \
    PUPPETEER_EXECUTABLE_PATH=/usr/bin/chromium

# 4. Lancer l’application
CMD ["node", "index.js"]
