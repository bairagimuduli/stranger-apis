import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DB_PATH = path.join(__dirname, '../../db.json');

// Initialize state if db.json doesn't exist
const initialState = {
  gateOpen: false,
  monsters: [
    { id: 1, name: "Demogorgon", health: 100 }
  ],
  energySpikes: [
    { id: 1, location: "Hawkins Lab", coordinates: [39.8283, -86.1754], zone: "lab", energy: 85 },
    { id: 2, location: "Byers House", coordinates: [39.8300, -86.1800], zone: "residential", energy: 45 },
    { id: 3, location: "Forest", coordinates: [39.8350, -86.1900], zone: "forest", energy: 60 },
    { id: 4, location: "School", coordinates: [39.8200, -86.1700], zone: "school", energy: 30 }
  ],
  inventory: [
    { id: 1, name: "Flashlight", type: "tool", quantity: 5 },
    { id: 2, name: "Radio", type: "communication", quantity: 3 },
    { id: 3, name: "First Aid Kit", type: "medical", quantity: 2 },
    { id: 4, name: "Energy Detector", type: "equipment", quantity: 1 }
  ],
  experiments: [],
  evidence: [],
  sessions: [],
  requestLogs: []
};

/**
 * Read state from db.json
 */
export function getState() {
  try {
    if (!fs.existsSync(DB_PATH)) {
      // Create initial state file
      fs.writeFileSync(DB_PATH, JSON.stringify(initialState, null, 2));
      return initialState;
    }
    const data = fs.readFileSync(DB_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading state:', error);
    return initialState;
  }
}

/**
 * Write state to db.json
 */
export function saveState(state) {
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(state, null, 2));
    return true;
  } catch (error) {
    console.error('Error saving state:', error);
    return false;
  }
}

/**
 * Update state with a partial update
 */
export function updateState(updates) {
  const currentState = getState();
  const newState = { ...currentState, ...updates };
  saveState(newState);
  return newState;
}

/**
 * Add a request log entry (keeps max 100 entries)
 * Enhanced with headers, cookies, query params, path params
 */
export function addRequestLog(logEntry) {
  const state = getState();
  state.requestLogs.unshift({
    method: logEntry.method,
    path: logEntry.path,
    query: logEntry.query || {},
    body: logEntry.body,
    ip: logEntry.ip || logEntry.ip,
    headers: logEntry.headers || {},
    cookies: logEntry.cookies || {},
    queryParams: logEntry.queryParams || {},
    pathParams: logEntry.pathParams || {},
    statusCode: logEntry.statusCode,
    timestamp: new Date().toISOString()
  });
  
  // Keep only last 100 entries
  if (state.requestLogs.length > 100) {
    state.requestLogs = state.requestLogs.slice(0, 100);
  }
  
  saveState(state);
  return state.requestLogs;
}

/**
 * Get last N request logs
 */
export function getRequestLogs(limit = 5) {
  const state = getState();
  return state.requestLogs.slice(0, limit);
}

/**
 * Get detailed request logs (last 10 with full data)
 */
export function getDetailedLogs(limit = 10) {
  const state = getState();
  return state.requestLogs.slice(0, limit);
}

/**
 * Add experiment to state
 */
export function addExperiment(experiment) {
  const state = getState();
  const newExperiment = {
    id: state.experiments.length + 1,
    ...experiment,
    createdAt: new Date().toISOString()
  };
  state.experiments.push(newExperiment);
  saveState(state);
  return newExperiment;
}

/**
 * Add evidence to state
 */
export function addEvidence(evidence) {
  const state = getState();
  const newEvidence = {
    id: state.evidence.length + 1,
    ...evidence,
    createdAt: new Date().toISOString()
  };
  state.evidence.push(newEvidence);
  saveState(state);
  return newEvidence;
}

/**
 * Get evidence by ID
 */
export function getEvidenceById(evidenceId) {
  const state = getState();
  return state.evidence.find(e => e.id === parseInt(evidenceId));
}

/**
 * Get inventory items
 */
export function getInventory() {
  const state = getState();
  return state.inventory;
}

/**
 * Use an inventory item (decrement quantity)
 */
export function useInventoryItem(itemId) {
  const state = getState();
  const item = state.inventory.find(i => i.id === parseInt(itemId));
  if (!item) {
    return null;
  }
  if (item.quantity <= 0) {
    return { error: 'Out of stock' };
  }
  item.quantity--;
  saveState(state);
  return item;
}

