import express from 'express';
import { generateToken } from '../utils/jwt.js';

const router = express.Router();

const USERNAME = process.env.USERNAME || 'admin';
const PASSWORD = process.env.PASSWORD || 'stranger123';

/**
 * @swagger
 * /auth/login:
 *   post:
 *     summary: Login to get JWT token
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: stranger123
 *     responses:
 *       200:
 *         description: Login successful
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 token:
 *                   type: string
 *                 message:
 *                   type: string
 *       401:
 *         description: Invalid credentials
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'Username and password are required' 
    });
  }
  
  if (username === USERNAME && password === PASSWORD) {
    const token = generateToken({ username, role: 'agent' });
    return res.json({
      token,
      message: 'Authentication successful. Welcome to Hawkins Lab.'
    });
  }
  
  res.status(401).json({ 
    error: 'Unauthorized',
    message: 'Invalid credentials' 
  });
});

/**
 * @swagger
 * /auth/session:
 *   post:
 *     summary: Create session with cookie (cookie-based auth example)
 *     tags: [Authentication]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - username
 *               - password
 *             properties:
 *               username:
 *                 type: string
 *                 example: admin
 *               password:
 *                 type: string
 *                 example: stranger123
 *     responses:
 *       200:
 *         description: Session created, cookie set
 *         headers:
 *           Set-Cookie:
 *             description: Session cookie
 *             schema:
 *               type: string
 *               example: hawkins_session=eyJhbGci...; HttpOnly; SameSite=Strict
 *       401:
 *         description: Invalid credentials
 */
router.post('/session', (req, res) => {
  const { username, password } = req.body;
  
  if (!username || !password) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'Username and password are required' 
    });
  }
  
  if (username === USERNAME && password === PASSWORD) {
    const token = generateToken({ username, role: 'agent' });
    
    // Set session cookie
    res.cookie('hawkins_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 24 * 60 * 60 * 1000 // 24 hours
    });
    
    return res.json({
      message: 'Session created successfully. Cookie set.',
      sessionActive: true
    });
  }
  
  res.status(401).json({ 
    error: 'Unauthorized',
    message: 'Invalid credentials' 
  });
});

export default router;

