/**
 * Application Configuration
 * Centralized configuration management
 */

export const config = {
  app: {
    name: process.env.APP_NAME || 'Dashboard Masjid Syamsul Ulum',
    url: process.env.APP_URL || 'http://localhost:3000',
    env: process.env.NODE_ENV || 'development',
  },

  database: {
    url: process.env.DATABASE_URL || '',
  },

  auth: {
    jwtSecret: process.env.JWT_SECRET || 'change-this-secret',
    jwtExpiresIn: process.env.JWT_EXPIRES_IN || '7d',
    jwtRefreshExpiresIn: process.env.JWT_REFRESH_EXPIRES_IN || '30d',
    nextAuthSecret: process.env.NEXTAUTH_SECRET || 'change-this-secret',
    nextAuthUrl: process.env.NEXTAUTH_URL || 'http://localhost:3000',
  },

  cors: {
    allowedOrigins: process.env.ALLOWED_ORIGINS?.split(',') || ['http://localhost:3001'],
  },

  upload: {
    maxFileSize: parseInt(process.env.MAX_FILE_SIZE || '5242880'), // 5MB
    uploadDir: process.env.UPLOAD_DIR || './public/uploads',
    allowedTypes: process.env.ALLOWED_FILE_TYPES?.split(',') || [
      'image/jpeg',
      'image/png',
      'image/jpg',
      'application/pdf',
    ],
  },

  pagination: {
    defaultPageSize: parseInt(process.env.DEFAULT_PAGE_SIZE || '10'),
    maxPageSize: parseInt(process.env.MAX_PAGE_SIZE || '100'),
  },

  rateLimit: {
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS || '900000'), // 15 minutes
    maxRequests: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS || '100'),
  },

  logging: {
    level: process.env.LOG_LEVEL || 'info',
    dir: process.env.LOG_DIR || './logs',
  },
} as const;

export default config;
