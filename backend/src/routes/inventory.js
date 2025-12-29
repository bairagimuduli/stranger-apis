import express from 'express';
import { getInventory, useInventoryItem } from '../utils/state.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

/**
 * @swagger
 * /inventory:
 *   get:
 *     summary: Get list of available inventory items
 *     tags: [Inventory]
 *     responses:
 *       200:
 *         description: List of inventory items
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: number
 *                       name:
 *                         type: string
 *                       type:
 *                         type: string
 *                       quantity:
 *                         type: number
 */
router.get('/', (req, res) => {
  const items = getInventory();
  res.json({
    items,
    message: 'Inventory retrieved successfully'
  });
});

/**
 * @swagger
 * /inventory/use-item:
 *   post:
 *     summary: Use an inventory item (requires authentication, stateful workflow)
 *     tags: [Inventory]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - item_id
 *             properties:
 *               item_id:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Item used successfully
 *       400:
 *         description: Bad request (missing item_id or out of stock)
 *       401:
 *         description: Unauthorized (missing or invalid token)
 *       404:
 *         description: Item not found
 */
router.post('/use-item', authenticate, (req, res) => {
  const { item_id } = req.body;
  
  if (!item_id) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'item_id is required',
      field: 'item_id'
    });
  }
  
  const result = useInventoryItem(item_id);
  
  if (!result) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Item with ID ${item_id} not found`,
      item_id
    });
  }
  
  if (result.error) {
    return res.status(400).json({
      error: 'Bad Request',
      message: result.error,
      item_id
    });
  }
  
  res.json({
    message: `Used ${result.name}`,
    item: result,
    remainingQuantity: result.quantity
  });
});

export default router;

