# Sử dụng Node.js 20 Alpine làm base image
FROM node:20-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json, cài dependencies
COPY package*.json ./
RUN npm install && npm install -g serve

# Copy toàn bộ source code vào container
COPY . .

# Build React app
RUN npm run build

# Copy entrypoint script
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /entrypoint.sh

# Mở port 5000
EXPOSE 5000

# Chạy entrypoint script khi container start
ENTRYPOINT ["/entrypoint.sh"]
