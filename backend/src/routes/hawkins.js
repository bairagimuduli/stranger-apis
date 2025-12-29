import express from 'express';
import { getState, updateState, getEvidenceById, addExperiment } from '../utils/state.js';

const router = express.Router();

/**
 * @swagger
 * /hawkins/map:
 *   get:
 *     summary: Get list of energy spikes (locations) with filtering and pagination
 *     tags: [Hawkins]
 *     parameters:
 *       - in: query
 *         name: zone
 *         schema:
 *           type: string
 *         description: Filter by zone (lab, residential, forest, school)
 *         example: forest
 *       - in: query
 *         name: min_energy
 *         schema:
 *           type: integer
 *         description: Minimum energy level
 *         example: 50
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Maximum number of results
 *         example: 5
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           default: 0
 *         description: Number of results to skip
 *         example: 0
 *     responses:
 *       200:
 *         description: List of energy spikes
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 energySpikes:
 *                   type: array
 *                   items:
 *                     type: object
 *                 total:
 *                   type: number
 *                 page:
 *                   type: number
 *                 hasMore:
 *                   type: boolean
 */
router.get('/map', (req, res) => {
  const state = getState();
  let filtered = [...state.energySpikes];
  
  // Filter by zone
  if (req.query.zone) {
    filtered = filtered.filter(spike => spike.zone === req.query.zone);
  }
  
  // Filter by minimum energy
  if (req.query.min_energy) {
    const minEnergy = parseInt(req.query.min_energy);
    if (!isNaN(minEnergy)) {
      filtered = filtered.filter(spike => spike.energy >= minEnergy);
    }
  }
  
  // Pagination
  const limit = parseInt(req.query.limit) || 10;
  const offset = parseInt(req.query.offset) || 0;
  const total = filtered.length;
  const paginated = filtered.slice(offset, offset + limit);
  const hasMore = offset + limit < total;
  
  res.json({
    energySpikes: paginated,
    total,
    page: Math.floor(offset / limit) + 1,
    hasMore,
    message: 'Energy spike locations retrieved'
  });
});

/**
 * @swagger
 * /hawkins/open:
 *   post:
 *     summary: Open the gate using an energy spike
 *     tags: [Hawkins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - spikeId
 *             properties:
 *               spikeId:
 *                 type: number
 *                 example: 1
 *     responses:
 *       200:
 *         description: Gate opened successfully
 *       400:
 *         description: Invalid spike ID
 */
router.post('/open', (req, res) => {
  const { spikeId } = req.body;
  const state = getState();
  
  if (!spikeId) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'spikeId is required' 
    });
  }
  
  const spike = state.energySpikes.find(s => s.id === spikeId);
  if (!spike) {
    return res.status(400).json({ 
      error: 'Bad Request',
      message: 'Invalid spikeId' 
    });
  }
  
  updateState({ gateOpen: true });
  
  res.json({
    message: `Gate opened using energy spike at ${spike.location}`,
    gateOpen: true,
    spikeUsed: spike
  });
});

/**
 * @swagger
 * /hawkins/evidence/{evidenceId}:
 *   get:
 *     summary: Get evidence by ID (path parameter example)
 *     tags: [Hawkins]
 *     parameters:
 *       - in: path
 *         name: evidenceId
 *         required: true
 *         schema:
 *           type: integer
 *         description: Evidence ID
 *         example: 1
 *     responses:
 *       200:
 *         description: Evidence details
 *       404:
 *         description: Evidence not found
 */
router.get('/evidence/:evidenceId', (req, res) => {
  const evidenceId = parseInt(req.params.evidenceId);
  
  if (isNaN(evidenceId)) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Invalid evidenceId. Must be a number.',
      field: 'evidenceId',
      value: req.params.evidenceId
    });
  }
  
  const evidence = getEvidenceById(evidenceId);
  
  if (!evidence) {
    return res.status(404).json({
      error: 'Not Found',
      message: `Evidence with ID ${evidenceId} not found`,
      evidenceId
    });
  }
  
  res.json({
    evidence,
    message: 'Evidence retrieved successfully'
  });
});

/**
 * @swagger
 * /hawkins/experiments:
 *   post:
 *     summary: Create a new experiment (nested JSON payload example)
 *     tags: [Hawkins]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - experimentName
 *               - subject
 *             properties:
 *               experimentName:
 *                 type: string
 *                 example: "Project MKUltra"
 *               subject:
 *                 type: object
 *                 required:
 *                   - name
 *                   - age
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Subject 011"
 *                   age:
 *                     type: number
 *                     example: 14
 *                   vitals:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         type:
 *                           type: string
 *                         value:
 *                           type: number
 *                         timestamp:
 *                           type: string
 *                   powers:
 *                     type: array
 *                     items:
 *                       type: object
 *                       properties:
 *                         ability:
 *                           type: string
 *                         level:
 *                           type: number
 *                         discovered:
 *                           type: string
 *               labNotes:
 *                 type: string
 *     responses:
 *       201:
 *         description: Experiment created successfully
 *       400:
 *         description: Invalid or missing required fields
 *       422:
 *         description: Validation error
 */
router.post('/experiments', (req, res) => {
  const { experimentName, subject, labNotes } = req.body;
  const errors = [];
  
  // Validate required fields
  if (!experimentName || typeof experimentName !== 'string') {
    errors.push({ field: 'experimentName', message: 'experimentName is required and must be a string' });
  }
  
  if (!subject || typeof subject !== 'object') {
    errors.push({ field: 'subject', message: 'subject is required and must be an object' });
  } else {
    if (!subject.name || typeof subject.name !== 'string') {
      errors.push({ field: 'subject.name', message: 'subject.name is required and must be a string' });
    }
    if (!subject.age || typeof subject.age !== 'number') {
      errors.push({ field: 'subject.age', message: 'subject.age is required and must be a number' });
    }
    if (subject.vitals && !Array.isArray(subject.vitals)) {
      errors.push({ field: 'subject.vitals', message: 'subject.vitals must be an array' });
    }
    if (subject.powers && !Array.isArray(subject.powers)) {
      errors.push({ field: 'subject.powers', message: 'subject.powers must be an array' });
    }
  }
  
  if (errors.length > 0) {
    return res.status(422).json({
      error: 'Validation Error',
      message: 'Invalid request data',
      details: errors
    });
  }
  
  const experiment = addExperiment({
    experimentName,
    subject,
    labNotes: labNotes || ''
  });
  
  res.status(201).json({
    message: 'Experiment created successfully',
    experiment
  });
});

export default router;

