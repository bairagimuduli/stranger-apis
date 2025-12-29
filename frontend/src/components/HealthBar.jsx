function HealthBar({ monster }) {
  if (!monster) {
    return (
      <div className="terminal p-6 neon-box-green">
        <h2 className="text-3xl font-retro neon-green mb-4 text-center">
          MONSTER STATUS
        </h2>
        <div className="text-crt-green-dark text-center">
          No monster data available
        </div>
      </div>
    );
  }

  const healthPercentage = Math.max(0, Math.min(100, monster.health));
  const healthColor = healthPercentage > 50 
    ? 'bg-crt-green' 
    : healthPercentage > 25 
    ? 'bg-yellow-500' 
    : 'bg-upside-down-red';

  return (
    <div className="terminal p-6 neon-box-green">
      <h2 className="text-3xl font-retro neon-green mb-4 text-center">
        MONSTER STATUS
      </h2>
      
      <div className="mb-4">
        <div className="text-xl mb-2 text-crt-green-dark">
          {monster.name.toUpperCase()}
        </div>
        <div className="text-3xl font-retro text-center mb-2">
          <span className={healthPercentage > 25 ? 'neon-green' : 'neon-red'}>
            {healthPercentage}%
          </span>
        </div>
      </div>

      {/* Health Bar */}
      <div className="relative w-full h-8 border-2 border-crt-green bg-hawkins-dark overflow-hidden">
        <div 
          className={`h-full transition-all duration-500 ${healthColor} ${
            healthPercentage > 50 ? 'neon-box-green' : 'neon-box-red'
          }`}
          style={{ width: `${healthPercentage}%` }}
        >
          <div className="h-full w-full bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse"></div>
        </div>
        <div className="absolute inset-0 flex items-center justify-center text-xs font-retro text-crt-green">
          {healthPercentage > 0 ? `${monster.health} HP` : 'ELIMINATED'}
        </div>
      </div>

      {/* Status Message */}
      <div className="mt-4 text-center text-sm">
        {healthPercentage === 100 && (
          <span className="text-crt-green">✓ Full health - Threat level: HIGH</span>
        )}
        {healthPercentage > 50 && healthPercentage < 100 && (
          <span className="text-yellow-400">⚠ Damaged - Threat level: MODERATE</span>
        )}
        {healthPercentage > 0 && healthPercentage <= 50 && (
          <span className="text-orange-400">⚠ Critical - Threat level: ELEVATED</span>
        )}
        {healthPercentage === 0 && (
          <span className="text-crt-green neon-green">✓ ELIMINATED - Threat neutralized</span>
        )}
      </div>
    </div>
  );
}

export default HealthBar;

