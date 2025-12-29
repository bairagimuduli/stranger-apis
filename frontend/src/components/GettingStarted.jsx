function GettingStarted({ onClose }) {
  return (
    <div className="terminal p-6 neon-box-green mb-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-3xl font-retro neon-green">
          GETTING STARTED
        </h2>
        <button
          onClick={onClose}
          className="text-crt-green hover:text-crt-green-dark text-2xl"
        >
          ✕
        </button>
      </div>
      
      <div className="space-y-4 text-sm">
        <div>
          <h3 className="text-xl text-crt-green mb-2">📚 Step 1: View API Documentation</h3>
          <p className="text-crt-green-dark mb-2">
            Open <a href={`${import.meta.env.VITE_API_URL || 'https://stranger-api-backend.onrender.com'}/docs`} target="_blank" rel="noopener noreferrer" className="text-crt-green underline hover:neon-green">Swagger UI</a> in a new tab to see all available endpoints.
          </p>
        </div>

        <div>
          <h3 className="text-xl text-crt-green mb-2">🔐 Step 2: Get Authentication Token</h3>
          <p className="text-crt-green-dark mb-2">
            In Swagger UI, use <code className="bg-hawkins-dark px-1">POST /auth/login</code> with:
          </p>
          <pre className="bg-hawkins-dark p-2 text-xs overflow-x-auto">
{`{
  "username": "admin",
  "password": "stranger123"
}`}
          </pre>
          <p className="text-crt-green-dark mt-2">
            Copy the <code className="bg-hawkins-dark px-1">token</code> from the response.
          </p>
        </div>

        <div>
          <h3 className="text-xl text-crt-green mb-2">🔓 Step 3: Authorize in Swagger</h3>
          <p className="text-crt-green-dark mb-2">
            Click the <strong className="text-crt-green">"Authorize"</strong> button (🔒) at the top of Swagger UI, paste your token, and click "Authorize".
          </p>
        </div>

        <div>
          <h3 className="text-xl text-crt-green mb-2">🗺️ Step 4: Explore the Map</h3>
          <p className="text-crt-green-dark mb-2">
            Try <code className="bg-hawkins-dark px-1">GET /hawkins/map</code> to see energy spike locations.
          </p>
        </div>

        <div>
          <h3 className="text-xl text-crt-green mb-2">🚪 Step 5: Open the Gate</h3>
          <p className="text-crt-green-dark mb-2">
            Use <code className="bg-hawkins-dark px-1">POST /hawkins/open</code> with <code className="bg-hawkins-dark px-1">{"{spikeId: 1}"}</code>
          </p>
          <p className="text-crt-green-dark">
            Watch the dashboard update! The gate status will change to <span className="text-upside-down-red">OPEN</span>.
          </p>
        </div>

        <div>
          <h3 className="text-xl text-crt-green mb-2">⚔️ Step 6: Damage the Monster</h3>
          <p className="text-crt-green-dark mb-2">
            Use <code className="bg-hawkins-dark px-1">PATCH /monsters/1</code> with <code className="bg-hawkins-dark px-1">{"{damage: 25}"}</code>
          </p>
          <p className="text-crt-green-dark">
            Watch the Demogorgon's health decrease on the dashboard!
          </p>
        </div>

        <div>
          <h3 className="text-xl text-crt-green mb-2">🔒 Step 7: Close the Gate</h3>
          <p className="text-crt-green-dark mb-2">
            Use <code className="bg-hawkins-dark px-1">DELETE /gate/1</code> (requires authentication token).
          </p>
          <p className="text-crt-green-dark">
            The gate will close and the dashboard will update.
          </p>
        </div>

        <div className="mt-6 p-3 bg-hawkins-dark border border-crt-green/50">
          <p className="text-crt-green text-sm">
            💡 <strong>Tip:</strong> All your API requests appear in the "Request Logs" panel on the right. The dashboard auto-updates every 3 seconds!
          </p>
        </div>
      </div>
    </div>
  );
}

export default GettingStarted;

