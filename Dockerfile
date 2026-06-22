FROM node:18-alpine AS build

WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .

ARG VITE_API_URL
ARG VITE_CHAT_URL
ENV VITE_API_URL=$VITE_API_URL
ENV VITE_CHAT_URL=$VITE_CHAT_URL

RUN npm run build

FROM node:18-alpine AS production
WORKDIR /app
RUN npm install -g serve
COPY --from=build /app/dist ./dist
EXPOSE 3000
CMD ["serve", "-s", "dist", "-l", "3000"]
