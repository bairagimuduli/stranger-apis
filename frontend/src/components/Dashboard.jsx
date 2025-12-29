import { useState, useEffect } from 'react';
import { getWorldState, getDetailedLogs } from '../services/api';
import MissionControl from './MissionControl';
import HealthBar from './HealthBar';
import LogsPanel from './LogsPanel';
import TerminalView from './TerminalView';
import GettingStarted from './GettingStarted';
import QuickActions from './QuickActions';

function Dashboard() {
  const [worldState, setWorldState] = useState({
    gateOpen: false,
    monsters: [],
    energySpikes: [],
    logs: []
  });
  const [detailedLogs, setDetailedLogs] = useState([]);
  const [showTerminalView, setShowTerminalView] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showGuide, setShowGuide] = useState(() => {
    // Show guide on first visit (check localStorage)
    return !localStorage.getItem('hasSeenGuide');
  });

  const fetchWorldState = async () => {
    try {
      const state = await getWorldState();
      setWorldState(state);
      setError(null);
    } catch (err) {
      console.error('Failed to fetch world state:', err);
      setError('Failed to connect to Hawkins Lab');
    } finally {
      setLoading(false);
    }
  };

  const fetchDetailedLogs = async () => {
    try {
      const logs = await getDetailedLogs();
      setDetailedLogs(logs);
    } catch (err) {
      console.error('Failed to fetch detailed logs:', err);
    }
  };

  useEffect(() => {
    // Initial fetch
    fetchWorldState();
    fetchDetailedLogs();
    
    // Set up polling every 3 seconds
    const interval = setInterval(() => {
      fetchWorldState();
      if (showTerminalView) {
        fetchDetailedLogs();
      }
    }, 3000);
    
    return () => clearInterval(interval);
  }, [showTerminalView]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hawkins-black text-crt-green">
        <div className="text-4xl neon-green flicker">
          INITIALIZING HAWKINS LAB...
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-hawkins-black text-upside-down-red">
        <div className="text-2xl neon-red">
          ERROR: {error}
        </div>
      </div>
    );
  }

  const demogorgon = worldState.monsters.find(m => m.name === 'Demogorgon') || worldState.monsters[0];

  const handleCloseGuide = () => {
    setShowGuide(false);
    localStorage.setItem('hasSeenGuide', 'true');
  };

  return (
    <div className="min-h-screen crt-screen bg-hawkins-black text-crt-green p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-8 text-center">
          <h1 className="text-5xl md:text-7xl font-retro neon-green mb-2">
            HAWKINS LAB
          </h1>
          <p className="text-2xl md:text-3xl text-crt-green-dark">
            MISSION CONTROL
          </p>
          <div className="mt-4 flex justify-center items-center gap-4 flex-wrap">
            <span className="text-sm text-crt-green-dark">
              Real-time monitoring of the Upside Down
            </span>
            <a
              href={`${import.meta.env.VITE_API_URL || 'https://stranger-api-backend.onrender.com'}/docs`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-sm text-crt-green hover:neon-green underline"
            >
              📚 API Docs
            </a>
            <button
              onClick={() => setShowGuide(true)}
              className="text-sm text-crt-green hover:neon-green underline"
            >
              📖 Getting Started
            </button>
          </div>
        </header>

        {/* Getting Started Guide */}
        {showGuide && <GettingStarted onClose={handleCloseGuide} />}

        {/* Main Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Mission Control - Left Column */}
          <div className="lg:col-span-1">
            <MissionControl 
              gateOpen={worldState.gateOpen}
              energySpikes={worldState.energySpikes}
            />
          </div>

          {/* Health Bar - Center Column */}
          <div className="lg:col-span-1">
            <HealthBar monster={demogorgon} />
          </div>

          {/* Logs Panel / Terminal View - Right Column */}
          <div className="lg:col-span-1">
            <div className="mb-2 flex gap-2 justify-end">
              <button
                onClick={() => setShowTerminalView(false)}
                className={`text-xs px-3 py-1 border ${
                  !showTerminalView
                    ? 'border-crt-green text-crt-green bg-crt-green/10'
                    : 'border-crt-green-dark text-crt-green-dark'
                }`}
              >
                Simple Logs
              </button>
              <button
                onClick={() => {
                  setShowTerminalView(true);
                  fetchDetailedLogs();
                }}
                className={`text-xs px-3 py-1 border ${
                  showTerminalView
                    ? 'border-crt-green text-crt-green bg-crt-green/10'
                    : 'border-crt-green-dark text-crt-green-dark'
                }`}
              >
                Terminal View
              </button>
            </div>
            {showTerminalView ? (
              <TerminalView logs={detailedLogs} />
            ) : (
              <LogsPanel logs={worldState.logs} />
            )}
          </div>
        </div>

        {/* Quick Actions - Bottom Section */}
        <div className="mt-6">
          <QuickActions 
            gateOpen={worldState.gateOpen}
            energySpikes={worldState.energySpikes}
          />
        </div>

        {/* Footer */}
        <footer className="mt-8 text-center text-sm text-crt-green-dark">
          <p>Status: OPERATIONAL | Last Update: {new Date().toLocaleTimeString()}</p>
        </footer>
      </div>
    </div>
  );
}

export default Dashboard;

