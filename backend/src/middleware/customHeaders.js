/**
 * Middleware to validate X-Hawkins-Lab-ID header
 */
export function requireLabId(req, res, next) {
  const labId = req.headers['x-hawkins-lab-id'];
  
  if (!labId) {
    return res.status(400).json({
      error: 'Bad Request',
      message: 'Missing required header: X-Hawkins-Lab-ID',
      details: 'This endpoint requires the X-Hawkins-Lab-ID header to be present.'
    });
  }
  
  // Optional: Validate format if needed
  const expectedLabId = process.env.X_HAWKINS_LAB_ID || 'LAB-001';
  if (labId !== expectedLabId) {
    return res.status(403).json({
      error: 'Forbidden',
      message: 'Invalid X-Hawkins-Lab-ID header value',
      details: `Expected format: ${expectedLabId}`
    });
  }
  
  req.labId = labId;
  next();
}

