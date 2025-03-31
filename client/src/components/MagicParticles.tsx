import { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';

interface ParticleProps {
  count?: number;
}

export default function MagicParticles({ count = 50 }: ParticleProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    
    // Clear existing particles
    container.innerHTML = '';
    
    // Create particles
    for (let i = 0; i < count; i++) {
      const particle = document.createElement('div');
      
      // Random position
      const posX = Math.random() * 100;
      const posY = Math.random() * 100;
      
      // Random size & animation
      const size = Math.random() * 4 + 2;
      const duration = Math.random() * 3 + 2;
      const delay = Math.random() * 5;
      const opacity = Math.random() * 0.7 + 0.3;
      
      // Apply styles
      particle.className = 'absolute rounded-full bg-hogwarts-gold bg-opacity-70 pointer-events-none';
      particle.style.left = `${posX}%`;
      particle.style.top = `${posY}%`;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.opacity = opacity.toString();
      
      // Apply animation with inline styles (for simplicity and to match design)
      particle.style.animation = `float ${duration}s ease-in-out ${delay}s infinite`;
      
      container.appendChild(particle);
    }
    
    // Clean up
    return () => {
      if (container) {
        container.innerHTML = '';
      }
    };
  }, [count]);
  
  return (
    <motion.div 
      ref={containerRef}
      className="particles-container absolute inset-0 overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.5, duration: 1 }}
    />
  );
}
