import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { fileURLToPath } from 'url';
import { dirname, join, resolve } from 'path';
import { readdirSync } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Get all route files with absolute paths
const routesDir = resolve(__dirname, './routes');
const routeFiles = readdirSync(routesDir)
  .filter(file => file.endsWith('.js'))
  .map(file => resolve(routesDir, file));

// Also try with pattern matching (swagger-jsdoc sometimes prefers this)
const apiPattern = resolve(routesDir, '*.js');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Stranger APIs - Hawkins Lab Mission Control',
      version: '1.0.0',
      description: 'A Stranger Things themed API automation playground. Test your API automation skills by interacting with the Upside Down!',
      contact: {
        name: 'Hawkins Lab',
      },
    },
    servers: [
      {
        url: process.env.API_URL || 'https://stranger-api-backend.onrender.com',
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
        apiKeyAuth: {
          type: 'apiKey',
          in: 'header',
          name: 'X-API-Key',
          description: 'API Key for civilian endpoints. Can also use X-Hawkins-API-Key header.'
        },
      },
    },
  },
  // Try both explicit files and pattern - swagger-jsdoc can be picky
  apis: [...routeFiles, apiPattern], // Array of absolute file paths + pattern
};

const specs = swaggerJsdoc(options);

// Debug: Log if paths were found
if (Object.keys(specs.paths || {}).length === 0) {
  console.warn('⚠️  Swagger: No paths found in specs. Check that route files have @swagger JSDoc comments.');
  console.warn('   Route files being scanned:', routeFiles);
} else {
  console.log('✅ Swagger: Found', Object.keys(specs.paths).length, 'API paths');
}

export { specs, swaggerUi };

