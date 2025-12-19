FROM node:20-alpine

WORKDIR /app

# Install deps first (better caching)
COPY package*.json ./
RUN npm install

# Copy app source
COPY . .

# Vite dev server port
EXPOSE 5173

# Required for Docker hot reload
CMD ["npm", "run", "dev", "--", "--host"]
