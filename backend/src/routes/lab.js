import express from 'express';
import multer from 'multer';
import { addEvidence } from '../utils/state.js';
import { requireLabId } from '../middleware/customHeaders.js';

const router = express.Router();

// Configure multer for file uploads
const storage = multer.memoryStorage(); // Store in memory (for demo purposes)
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024 // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Accept images, text files, and JSON
    const allowedMimes = [
      'image/jpeg',
      'image/png',
      'image/gif',
      'image/webp',
      'text/plain',
      'text/csv',
      'application/json',
      'text/html'
    ];
    
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error(`File type ${file.mimetype} not allowed. Allowed types: ${allowedMimes.join(', ')}`), false);
    }
  }
});

/**
 * @swagger
 * /lab/upload-evidence:
 *   post:
 *     summary: Upload evidence file (multipart/form-data example)
 *     tags: [Lab]
 *     parameters:
 *       - in: header
 *         name: X-Hawkins-Lab-ID
 *         required: true
 *         schema:
 *           type: string
 *         description: Lab ID header
 *         example: LAB-001
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             required:
 *               - file
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *                 description: Evidence file (image, text, or JSON)
 *               description:
 *                 type: string
 *                 description: Optional description
 *                 example: "Photo from Hawkins Lab incident"
 *               location:
 *                 type: string
 *                 description: Optional location where evidence was found
 *                 example: "Hawkins Lab - Basement"
 *     responses:
 *       201:
 *         description: File uploaded successfully
 *       400:
 *         description: Bad request (missing file or invalid file type)
 *       413:
 *         description: File too large (max 5MB)
 */
router.post('/upload-evidence', requireLabId, upload.single('file'), (req, res) => {
  if (!req.file) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'No file uploaded',
      details: 'Please provide a file in the "file" field'
    });
  }
  
  const { description, location } = req.body;
  
  // Create evidence record
  const evidence = addEvidence({
    filename: req.file.originalname,
    mimetype: req.file.mimetype,
    size: req.file.size,
    description: description || '',
    location: location || '',
    uploadedAt: new Date().toISOString(),
    labId: req.labId
  });
  
  res.status(201).json({
    message: 'Evidence uploaded successfully',
    evidence: {
      id: evidence.id,
      filename: evidence.filename,
      mimetype: evidence.mimetype,
      size: evidence.size,
      description: evidence.description,
      location: evidence.location,
      uploadedAt: evidence.uploadedAt
    }
  });
});

export default router;

