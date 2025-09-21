FROM node:22-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

# Generate tsconfig & tailwind jika belum ada
RUN [ ! -f "tsconfig.json" ] && npx tsc --init || true
RUN [ ! -f "tailwind.config.js" ] && npx tailwindcss init -p || true

EXPOSE 3000

CMD ["npm", "run", "dev"]
