function QuickActions({ gateOpen, energySpikes }) {
  const apiUrl = import.meta.env.VITE_API_URL || 'https://stranger-api-backend.onrender.com';

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    // You could add a toast notification here
  };

  return (
    <div className="terminal p-6 neon-box-green">
      <h2 className="text-3xl font-retro neon-green mb-4 text-center">
        QUICK ACTIONS
      </h2>
      
      <div className="space-y-3 text-sm">
        <div>
          <h3 className="text-lg text-crt-green mb-2">🔐 Get Token</h3>
          <div className="bg-hawkins-dark p-2 text-xs font-mono overflow-x-auto mb-2">
            curl -X POST {apiUrl}/auth/login \<br/>
            &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
            &nbsp;&nbsp;-d '{"{"}"username":"admin","password":"stranger123"{"}"}'
          </div>
          <button
            onClick={() => copyToClipboard(`curl -X POST ${apiUrl}/auth/login -H "Content-Type: application/json" -d '{"username":"admin","password":"stranger123"}'`)}
            className="text-xs text-crt-green-dark hover:text-crt-green"
          >
            📋 Copy
          </button>
        </div>

        {!gateOpen && (
          <div>
            <h3 className="text-lg text-crt-green mb-2">🚪 Open Gate</h3>
            <div className="bg-hawkins-dark p-2 text-xs font-mono overflow-x-auto mb-2">
              curl -X POST {apiUrl}/hawkins/open \<br/>
              &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
              &nbsp;&nbsp;-d '{"{"}"spikeId":1{"}"}'
            </div>
            <button
              onClick={() => copyToClipboard(`curl -X POST ${apiUrl}/hawkins/open -H "Content-Type: application/json" -d '{"spikeId":1}'`)}
              className="text-xs text-crt-green-dark hover:text-crt-green"
            >
              📋 Copy
            </button>
          </div>
        )}

        {gateOpen && (
          <div>
            <h3 className="text-lg text-crt-green mb-2">🔒 Close Gate</h3>
            <div className="bg-hawkins-dark p-2 text-xs font-mono overflow-x-auto mb-2">
              curl -X DELETE {apiUrl}/gate/1 \<br/>
              &nbsp;&nbsp;-H "Authorization: Bearer YOUR_TOKEN"
            </div>
            <p className="text-xs text-crt-green-dark mb-2">
              (Requires authentication token)
            </p>
          </div>
        )}

        <div>
          <h3 className="text-lg text-crt-green mb-2">⚔️ Damage Monster</h3>
          <div className="bg-hawkins-dark p-2 text-xs font-mono overflow-x-auto mb-2">
            curl -X PATCH {apiUrl}/monsters/1 \<br/>
            &nbsp;&nbsp;-H "Content-Type: application/json" \<br/>
            &nbsp;&nbsp;-d '{"{"}"damage":25{"}"}'
          </div>
          <button
            onClick={() => copyToClipboard(`curl -X PATCH ${apiUrl}/monsters/1 -H "Content-Type: application/json" -d '{"damage":25}'`)}
            className="text-xs text-crt-green-dark hover:text-crt-green"
          >
            📋 Copy
          </button>
        </div>

        <div className="mt-4 p-2 bg-hawkins-dark border border-crt-green/30">
          <p className="text-xs text-crt-green-dark">
            💡 Use Swagger UI for interactive testing: <a href={`${apiUrl}/docs`} target="_blank" rel="noopener noreferrer" className="text-crt-green underline">/docs</a>
          </p>
        </div>
      </div>
    </div>
  );
}

export default QuickActions;

