import { addRequestLog } from '../utils/state.js';

/**
 * Enhanced request logging middleware
 * Captures headers, cookies, query params, path params, and response status
 */
export function requestLogger(req, res, next) {
  // Capture all headers (masking sensitive ones)
  const headers = { ...req.headers };
  // Mask authorization header if present
  if (headers.authorization) {
    headers.authorization = 'Bearer ***';
  }
  
  // Capture cookies
  const cookies = req.cookies || {};
  
  // Capture query parameters
  const queryParams = { ...req.query };
  
  // Capture path parameters
  const pathParams = { ...req.params };
  
  // Store original end function
  const originalEnd = res.end;
  const originalJson = res.json;
  
  // Override res.json to capture response status
  res.json = function(body) {
    const logEntry = {
      method: req.method,
      path: req.path,
      query: req.query,
      body: req.method !== 'GET' && req.method !== 'DELETE' ? req.body : undefined,
      ip: req.ip || req.connection?.remoteAddress,
      headers: headers,
      cookies: cookies,
      queryParams: queryParams,
      pathParams: pathParams,
      statusCode: res.statusCode
    };
    
    // Log the request with response status
    addRequestLog(logEntry);
    
    // Call original json
    return originalJson.call(this, body);
  };
  
  // Override res.end to capture status for non-JSON responses
  res.end = function(chunk, encoding) {
    if (!res.headersSent) {
      const logEntry = {
        method: req.method,
        path: req.path,
        query: req.query,
        body: req.method !== 'GET' && req.method !== 'DELETE' ? req.body : undefined,
        ip: req.ip || req.connection?.remoteAddress,
        headers: headers,
        cookies: cookies,
        queryParams: queryParams,
        pathParams: pathParams,
        statusCode: res.statusCode
      };
      
      addRequestLog(logEntry);
    }
    
    return originalEnd.call(this, chunk, encoding);
  };
  
  next();
}

