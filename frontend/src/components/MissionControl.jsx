function MissionControl({ gateOpen, energySpikes }) {
  return (
    <div className="terminal p-6 neon-box-green">
      <h2 className="text-3xl font-retro neon-green mb-4 text-center">
        MISSION CONTROL
      </h2>
      
      {/* Gate Status */}
      <div className="mb-6">
        <div className="text-xl mb-2 text-crt-green-dark">GATE STATUS:</div>
        <div className={`text-4xl font-retro text-center py-4 border-2 ${
          gateOpen 
            ? 'border-upside-down-red neon-red neon-box-red bg-red-900/20' 
            : 'border-crt-green neon-green neon-box-green bg-green-900/20'
        }`}>
          {gateOpen ? 'OPEN' : 'CLOSED'}
        </div>
        <div className="text-sm text-crt-green-dark mt-2 text-center">
          {gateOpen 
            ? '⚠️ WARNING: Upside Down breach detected!' 
            : '✓ Gate is secure'}
        </div>
      </div>

      {/* Energy Spikes */}
      <div className="mt-6">
        <div className="text-xl mb-3 text-crt-green-dark">ENERGY SPIKES:</div>
        <div className="space-y-2">
          {energySpikes && energySpikes.length > 0 ? (
            energySpikes.map((spike) => (
              <div 
                key={spike.id}
                className="p-2 border border-crt-green/50 bg-hawkins-dark/50 text-sm"
              >
                <div className="text-crt-green">📍 {spike.location}</div>
                <div className="text-crt-green-dark text-xs mt-1">
                  ID: {spike.id} | Coords: [{spike.coordinates.join(', ')}]
                </div>
              </div>
            ))
          ) : (
            <div className="text-crt-green-dark text-sm">No energy spikes detected</div>
          )}
        </div>
      </div>
    </div>
  );
}

export default MissionControl;

