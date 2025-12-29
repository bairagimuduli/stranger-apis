import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import cookieParser from 'cookie-parser';
import { swaggerUi, specs } from './swagger.js';
import { requestLogger } from './middleware/logger.js';
import { getState, getRequestLogs } from './utils/state.js';

// Routes
import authRoutes from './routes/auth.js';
import hawkinsRoutes from './routes/hawkins.js';
import monstersRoutes from './routes/monsters.js';
import gateRoutes from './routes/gate.js';
import labRoutes from './routes/lab.js';
import inventoryRoutes from './routes/inventory.js';
import upsideDownRoutes from './routes/upsideDown.js';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware (applied to all routes)
app.use(requestLogger);

// Initialize state
getState();
console.log('Hawkins Lab state initialized');

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'operational',
    message: 'Hawkins Lab is online',
    timestamp: new Date().toISOString()
  });
});

// World state endpoint for frontend
app.get('/world-state', (req, res) => {
  const state = getState();
  const logs = getRequestLogs(5);
  
  res.json({
    gateOpen: state.gateOpen,
    monsters: state.monsters,
    energySpikes: state.energySpikes,
    logs: logs
  });
});

// Detailed logs endpoint
app.get('/logs/detailed', (req, res) => {
  const logs = getDetailedLogs(10);
  
  res.json({
    logs: logs,
    count: logs.length,
    message: 'Detailed request logs retrieved'
  });
});

// API Routes
app.use('/auth', authRoutes);
app.use('/hawkins', hawkinsRoutes);
app.use('/monsters', monstersRoutes);
app.use('/gate', gateRoutes);
app.use('/lab', labRoutes);
app.use('/inventory', inventoryRoutes);
app.use('/upside-down', upsideDownRoutes);

// Swagger Documentation
app.use('/docs', swaggerUi.serve);
app.get('/docs', swaggerUi.setup(specs, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'Stranger APIs - Documentation',
  customfavIcon: '/favicon.ico',
  swaggerOptions: {
    persistAuthorization: true,
  },
}));

// Swagger JSON endpoint (for debugging)
app.get('/docs.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(specs);
});

// Root endpoint
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to Stranger APIs - Hawkins Lab Mission Control',
    version: '1.0.0',
    endpoints: {
      docs: '/docs',
      health: '/health',
      auth: '/auth/login',
      session: '/auth/session',
      map: '/hawkins/map',
      evidence: '/hawkins/evidence/:evidenceId',
      experiments: '/hawkins/experiments',
      portal: '/hawkins/open',
      monsters: '/monsters/:id',
      gate: '/gate/:gateId',
      inventory: '/inventory',
      useItem: '/inventory/use-item',
      uploadEvidence: '/lab/upload-evidence',
      glitch: '/upside-down/glitch',
      detailedLogs: '/logs/detailed'
    }
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Not Found',
    message: 'The endpoint you are looking for does not exist in this dimension.'
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal Server Error',
    message: 'Something went wrong in the Upside Down.'
  });
});

// Start server
const server = app.listen(PORT, () => {
  console.log(`🚀 Hawkins Lab API is running on port ${PORT}`);
  console.log(`📚 API Documentation available at http://localhost:${PORT}/docs`);
  if (process.env.RENDER_EXTERNAL_URL) {
    console.log(`🌐 Production URL: ${process.env.RENDER_EXTERNAL_URL}/docs`);
  }
  console.log(`🔐 Default credentials: ${process.env.USERNAME || 'admin'} / ${process.env.PASSWORD || 'stranger123'}`);
});

// Handle port already in use error
server.on('error', (err) => {
  if (err.code === 'EADDRINUSE') {
    console.error(`\n❌ Port ${PORT} is already in use.`);
    console.error(`💡 Solutions:`);
    console.error(`   1. Kill the process using port ${PORT}: lsof -ti:${PORT} | xargs kill -9`);
    console.error(`   2. Use a different port: PORT=3001 npm run dev`);
    console.error(`   3. Update your .env file with a different PORT value\n`);
    process.exit(1);
  } else {
    throw err;
  }
});

