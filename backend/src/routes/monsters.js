import express from 'express';
import { getState, saveState } from '../utils/state.js';

const router = express.Router();

/**
 * @swagger
 * /monsters/{id}:
 *   patch:
 *     summary: Damage a monster (reduce health)
 *     tags: [Monsters]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: integer
 *         description: Monster ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - damage
 *             properties:
 *               damage:
 *                 type: number
 *                 example: 25
 *     responses:
 *       200:
 *         description: Monster damaged successfully
 *       400:
 *         description: Invalid monster ID or damage value
 *       404:
 *         description: Monster not found
 */
router.patch('/:id', (req, res) => {
  const monsterId = parseInt(req.params.id);
  const { damage } = req.body;
  
  if (!damage || typeof damage !== 'number' || damage <= 0) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'Valid damage value (positive number) is required' 
    });
  }
  
  const state = getState();
  const monster = state.monsters.find(m => m.id === monsterId);
  
  if (!monster) {
    return res.status(404).json({ 
      error: 'Not Found',
      message: 'Monster not found' 
    });
  }
  
  monster.health = Math.max(0, monster.health - damage);
  
  saveState(state);
  
  res.json({
    message: `${monster.name} took ${damage} damage`,
    monster: {
      id: monster.id,
      name: monster.name,
      health: monster.health
    }
  });
});

export default router;

