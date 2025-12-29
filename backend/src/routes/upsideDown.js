import express from 'express';

const router = express.Router();

/**
 * @swagger
 * /upside-down/glitch:
 *   get:
 *     summary: Flaky endpoint that randomly returns 503 (for retry logic testing)
 *     tags: [Upside Down]
 *     description: |
 *       This endpoint randomly fails with 503 Service Unavailable based on GLITCH_FAILURE_RATE.
 *       Use this to test retry logic in your automation scripts.
 *     responses:
 *       200:
 *         description: Success (when it works)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 timestamp:
 *                   type: string
 *       503:
 *         description: Service Unavailable (random failure)
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 error:
 *                   type: string
 *                 message:
 *                   type: string
 */
router.get('/glitch', (req, res) => {
  const failureRate = parseFloat(process.env.GLITCH_FAILURE_RATE) || 30;
  const random = Math.random() * 100;
  
  if (random < failureRate) {
    return res.status(503).json({
      error: 'Service Unavailable',
      message: 'The Upside Down is glitching. Try again later.',
      glitch: true,
      timestamp: new Date().toISOString()
    });
  }
  
  res.json({
    message: 'Connection stable. No glitches detected.',
    timestamp: new Date().toISOString(),
    glitch: false
  });
});

export default router;

