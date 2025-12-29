/**
 * API Key authentication middleware
 * Validates X-API-Key or X-Hawkins-API-Key header
 * Can work alongside JWT (flexible auth)
 */
export function validateApiKey(req, res, next) {
  const apiKey = req.headers['x-api-key'] || req.headers['x-hawkins-api-key'];
  const expectedApiKey = process.env.HAWKINS_API_KEY || 'hawkins-civilian-2024';
  
  if (!apiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Missing API key',
      details: 'This endpoint requires an API key in the X-API-Key or X-Hawkins-API-Key header.'
    });
  }
  
  if (apiKey !== expectedApiKey) {
    return res.status(401).json({
      error: 'Unauthorized',
      message: 'Invalid API key',
      details: 'The provided API key is not valid.'
    });
  }
  
  req.apiKey = apiKey;
  next();
}

