import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

/**
 * Get complete world state (gate, monsters, energy spikes, logs)
 */
export async function getWorldState() {
  try {
    const response = await api.get('/world-state');
    return response.data;
  } catch (error) {
    console.error('Error fetching world state:', error);
    throw error;
  }
}

/**
 * Get energy spikes map
 */
export async function getMap() {
  try {
    const response = await api.get('/hawkins/map');
    return response.data;
  } catch (error) {
    console.error('Error fetching map:', error);
    throw error;
  }
}

/**
 * Get request logs
 */
export async function getLogs() {
  try {
    const state = await getWorldState();
    return state.logs || [];
  } catch (error) {
    console.error('Error fetching logs:', error);
    return [];
  }
}

/**
 * Get detailed request logs with headers, cookies, etc.
 */
export async function getDetailedLogs() {
  try {
    const response = await api.get('/logs/detailed');
    return response.data.logs || [];
  } catch (error) {
    console.error('Error fetching detailed logs:', error);
    return [];
  }
}

export default api;
