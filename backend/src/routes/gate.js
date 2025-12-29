import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { updateState } from '../utils/state.js';

const router = express.Router();

/**
 * @swagger
 * /gate/{gateId}:
 *   delete:
 *     summary: Close the gate (requires authentication)
 *     tags: [Gate]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: gateId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Gate ID
 *     responses:
 *       200:
 *         description: Gate closed successfully
 *       401:
 *         description: Unauthorized - Token required
 *       404:
 *         description: Gate not found
 */
router.delete('/:gateId', authenticate, (req, res) => {
  const gateId = parseInt(req.params.gateId);
  
  // For simplicity, we'll accept any gateId and close the gate
  updateState({ gateOpen: false });
  
  res.json({
    message: `Gate ${gateId} has been closed. The Upside Down is sealed.`,
    gateOpen: false
  });
});

export default router;

