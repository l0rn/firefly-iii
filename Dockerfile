FROM fireflyiii/base:latest

# Build arguments
ARG NODE_VERSION=22

# Switch to root for setup
USER root

# Install Node.js for frontend build
RUN curl -fsSL https://deb.nodesource.com/setup_${NODE_VERSION}.x | bash - && \
    apt-get install -y nodejs && \
    rm -rf /var/lib/apt/lists/*

# Set working directory
WORKDIR /var/www/html

# Copy composer files first for layer caching
COPY --chown=www-data:www-data composer.json composer.lock ./

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copy the rest of the application
COPY --chown=www-data:www-data . .

# Install PHP dependencies (no dev, optimized autoloader)
RUN composer install \
    --no-dev \
    --prefer-dist \
    --optimize-autoloader \
    --no-scripts \
    --no-interaction \
    --no-progress

# Install Node dependencies and build frontend assets
RUN npm ci && \
    npm run prod --workspace=v1 && \
    npm run build --workspace=v2 && \
    rm -rf node_modules

# Set correct permissions
RUN chown -R www-data:www-data /var/www/html && \
    chmod -R 775 /var/www/html/storage /var/www/html/bootstrap/cache

# Switch back to www-data user
USER www-data

EXPOSE 8080
