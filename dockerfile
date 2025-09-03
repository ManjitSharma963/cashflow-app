# Multi-stage Dockerfile for CashFlow React Application

# Stage 1: Development (optional - for development use)
FROM node:18-alpine as development
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./
RUN npm ci --only=production=false

# Copy source code
COPY . .

# Expose port for development server
EXPOSE 3000

# Start development server with hot reload
CMD ["npm", "start"]

# Stage 2: Build
FROM node:18-alpine as build
WORKDIR /app

# Copy package files first for better layer caching
COPY package*.json ./

# Install dependencies (production + dev for build tools)
RUN npm ci --only=production=false && npm cache clean --force

# Copy source code
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production
FROM nginx:alpine as production

# Install curl for health checks
RUN apk add --no-cache curl

# Create nginx configuration for React SPA
RUN echo 'server { \
    listen 80; \
    server_name localhost; \
    root /usr/share/nginx/html; \
    index index.html; \
    \
    # Security headers \
    add_header X-Frame-Options "SAMEORIGIN" always; \
    add_header X-Content-Type-Options "nosniff" always; \
    add_header X-XSS-Protection "1; mode=block" always; \
    \
    # Gzip compression \
    gzip on; \
    gzip_vary on; \
    gzip_min_length 1024; \
    gzip_types text/plain text/css application/json application/javascript text/xml application/xml application/xml+rss text/javascript; \
    \
    # Cache static assets \
    location ~* \.(js|css|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$ { \
        expires 1y; \
        add_header Cache-Control "public, immutable"; \
        try_files $uri =404; \
    } \
    \
    # Handle React Router (SPA routing) \
    location / { \
        try_files $uri $uri/ /index.html; \
        add_header Cache-Control "no-cache"; \
    } \
    \
    # Health check endpoint \
    location /health { \
        access_log off; \
        return 200 "healthy\n"; \
        add_header Content-Type text/plain; \
    } \
}' > /etc/nginx/conf.d/default.conf

# Copy built application from build stage
COPY --from=build /app/build /usr/share/nginx/html

# Create non-root user for security
RUN addgroup -g 1001 -S appgroup && \
    adduser -S appuser -u 1001 -G appgroup

# Set proper permissions
RUN chown -R appuser:appgroup /usr/share/nginx/html && \
    chown -R appuser:appgroup /var/cache/nginx && \
    chown -R appuser:appgroup /var/log/nginx && \
    chown -R appuser:appgroup /etc/nginx/conf.d && \
    touch /var/run/nginx.pid && \
    chown -R appuser:appgroup /var/run/nginx.pid

# Switch to non-root user
USER appuser

# Expose port 80
EXPOSE 80

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD curl -f http://localhost:80/health || exit 1

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
