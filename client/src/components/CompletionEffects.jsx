import { useEffect, useState } from 'react';
import './CompletionEffects.css';

function CompletionEffects({ effect, trigger }) {
  const [particles, setParticles] = useState([]);
  const [showEffect, setShowEffect] = useState(false);

  useEffect(() => {
    if (trigger) {
      setShowEffect(true);
      generateParticles();

      const timer = setTimeout(() => {
        setShowEffect(false);
        setParticles([]);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [trigger, effect]);

  const generateParticles = () => {
    const particleCount = effect === 'fireworks' ? 50 : effect === 'stars' ? 30 : 60;
    const newParticles = [];

    for (let i = 0; i < particleCount; i++) {
      newParticles.push({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        delay: Math.random() * 0.5,
        duration: 1 + Math.random() * 2,
        rotation: Math.random() * 360,
        scale: 0.5 + Math.random() * 1
      });
    }

    setParticles(newParticles);
  };

  const getParticleContent = () => {
    switch (effect) {
      case 'fireworks':
        return ['✨', '💥', '⭐', '🎆', '🌟'];
      case 'confetti':
        return ['🎉', '🎊', '🎈', '✨', '🎀'];
      case 'stars':
        return ['⭐', '✨', '🌟', '💫', '⚡'];
      default:
        return ['✨'];
    }
  };

  const particleContent = getParticleContent();

  if (!showEffect || !effect) return null;

  return (
    <div className={`completion-effects ${effect}`}>
      {particles.map(particle => (
        <div
          key={particle.id}
          className={`particle ${effect}-particle`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            transform: `rotate(${particle.rotation}deg) scale(${particle.scale})`
          }}
        >
          {particleContent[particle.id % particleContent.length]}
        </div>
      ))}
    </div>
  );
}

export default CompletionEffects;
