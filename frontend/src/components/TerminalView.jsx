import { useState } from 'react';

function TerminalView({ logs }) {
  const [expandedRows, setExpandedRows] = useState(new Set());

  const toggleRow = (index) => {
    const newExpanded = new Set(expandedRows);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedRows(newExpanded);
  };

  const getStatusColor = (statusCode) => {
    if (!statusCode) return 'text-crt-green-dark';
    if (statusCode >= 200 && statusCode < 300) return 'text-crt-green';
    if (statusCode >= 400 && statusCode < 500) return 'text-yellow-400';
    if (statusCode >= 500) return 'text-upside-down-red';
    return 'text-crt-green-dark';
  };

  const formatHeaders = (headers) => {
    if (!headers || Object.keys(headers).length === 0) return 'None';
    return Object.entries(headers)
      .map(([key, value]) => `${key}: ${value}`)
      .join('\n');
  };

  const formatCookies = (cookies) => {
    if (!cookies || Object.keys(cookies).length === 0) return 'None';
    return Object.entries(cookies)
      .map(([key, value]) => `${key}=${value}`)
      .join('; ');
  };

  return (
    <div className="terminal p-6 neon-box-green">
      <h2 className="text-3xl font-retro neon-green mb-4 text-center">
        TERMINAL VIEW
      </h2>
      <div className="text-sm text-crt-green-dark mb-4 text-center">
        Last 10 requests with full headers, cookies, and details
      </div>

      <div className="space-y-2 max-h-96 overflow-y-auto">
        {logs && logs.length > 0 ? (
          logs.map((log, index) => {
            const isExpanded = expandedRows.has(index);
            const statusColor = getStatusColor(log.statusCode);
            
            return (
              <div
                key={index}
                className="border border-crt-green/30 bg-hawkins-dark/50 text-xs font-mono"
              >
                {/* Header Row */}
                <div
                  className="p-2 cursor-pointer hover:bg-hawkins-dark flex items-center justify-between"
                  onClick={() => toggleRow(index)}
                >
                  <div className="flex items-center gap-3 flex-wrap">
                    <span className={`font-bold ${getStatusColor(log.statusCode)}`}>
                      {log.method || 'GET'}
                    </span>
                    <span className="text-crt-green">{log.path || '/'}</span>
                    {log.statusCode && (
                      <span className={statusColor}>
                        [{log.statusCode}]
                      </span>
                    )}
                    <span className="text-crt-green-dark text-xs">
                      {log.timestamp ? new Date(log.timestamp).toLocaleTimeString() : 'N/A'}
                    </span>
                  </div>
                  <span className="text-crt-green-dark">
                    {isExpanded ? '▼' : '▶'}
                  </span>
                </div>

                {/* Expanded Details */}
                {isExpanded && (
                  <div className="p-3 border-t border-crt-green/20 space-y-2 text-xs">
                    {/* Query Parameters */}
                    {log.queryParams && Object.keys(log.queryParams).length > 0 && (
                      <div>
                        <div className="text-crt-green font-bold mb-1">Query Params:</div>
                        <pre className="text-crt-green-dark bg-hawkins-black p-2 overflow-x-auto">
                          {JSON.stringify(log.queryParams, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Path Parameters */}
                    {log.pathParams && Object.keys(log.pathParams).length > 0 && (
                      <div>
                        <div className="text-crt-green font-bold mb-1">Path Params:</div>
                        <pre className="text-crt-green-dark bg-hawkins-black p-2 overflow-x-auto">
                          {JSON.stringify(log.pathParams, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* Headers */}
                    <div>
                      <div className="text-crt-green font-bold mb-1">Headers:</div>
                      <pre className="text-crt-green-dark bg-hawkins-black p-2 overflow-x-auto whitespace-pre-wrap">
                        {formatHeaders(log.headers)}
                      </pre>
                    </div>

                    {/* Cookies */}
                    <div>
                      <div className="text-crt-green font-bold mb-1">Cookies:</div>
                      <div className="text-crt-green-dark bg-hawkins-black p-2">
                        {formatCookies(log.cookies)}
                      </div>
                    </div>

                    {/* Request Body */}
                    {log.body && (
                      <div>
                        <div className="text-crt-green font-bold mb-1">Request Body:</div>
                        <pre className="text-crt-green-dark bg-hawkins-black p-2 overflow-x-auto">
                          {typeof log.body === 'string' ? log.body : JSON.stringify(log.body, null, 2)}
                        </pre>
                      </div>
                    )}

                    {/* IP Address */}
                    {log.ip && (
                      <div className="text-crt-green-dark">
                        <span className="text-crt-green">IP:</span> {log.ip}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div className="text-crt-green-dark text-sm text-center py-8">
            No detailed logs available yet
            <div className="text-xs mt-2">
              Send requests to the API to see detailed information here
            </div>
          </div>
        )}
      </div>

      <div className="mt-4 text-xs text-crt-green-dark text-center">
        Click on any request to expand and view full details
      </div>
    </div>
  );
}

export default TerminalView;

