FROM node:22.14.0
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 1234
CMD ["node", "app.js"]