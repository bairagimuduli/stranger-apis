function LogsPanel({ logs }) {
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return 'N/A';
    try {
      const date = new Date(timestamp);
      return date.toLocaleTimeString();
    } catch {
      return timestamp;
    }
  };

  const formatMethod = (method) => {
    const colors = {
      GET: 'text-crt-green',
      POST: 'text-yellow-400',
      PATCH: 'text-blue-400',
      DELETE: 'text-upside-down-red',
      PUT: 'text-purple-400',
    };
    return colors[method] || 'text-crt-green-dark';
  };

  return (
    <div className="terminal p-6 neon-box-green">
      <h2 className="text-3xl font-retro neon-green mb-4 text-center">
        REQUEST LOGS
      </h2>
      
      <div className="text-sm text-crt-green-dark mb-3">
        Last 5 API Requests:
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs && logs.length > 0 ? (
          logs.map((log, index) => (
            <div 
              key={index}
              className="p-3 border border-crt-green/30 bg-hawkins-dark/50 text-xs font-mono"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className={`font-bold ${formatMethod(log.method)}`}>
                  {log.method || 'GET'}
                </span>
                <span className="text-crt-green-dark">|</span>
                <span className="text-crt-green">{log.path || '/'}</span>
              </div>
              <div className="text-crt-green-dark text-xs mt-1">
                {formatTimestamp(log.timestamp)}
              </div>
              {log.query && Object.keys(log.query).length > 0 && (
                <div className="text-crt-green-dark text-xs mt-1">
                  Query: {JSON.stringify(log.query)}
                </div>
              )}
              {log.body && (
                <div className="text-crt-green-dark text-xs mt-1 truncate">
                  Body: {JSON.stringify(log.body).substring(0, 50)}...
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-crt-green-dark text-sm text-center py-8">
            No requests logged yet
            <div className="text-xs mt-2">
              Send requests to the API to see them here
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-crt-green-dark text-center">
        Auto-refreshing every 3 seconds
      </div>
    </div>
  );
}

export default LogsPanel;

