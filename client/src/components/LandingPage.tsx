import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FontHarryP } from "@/components/ui/font-harry-p";
import MagicParticles from "@/components/MagicParticles";
import { useSound } from "@/hooks/use-sound";
import { fadeUp, fadeIn } from "@/lib/animations";
import { useCallback } from "react";
import { useLocation } from "wouter";
import backgroundImage from "@assets/hogwarts_legacy___ever_edition_4k_wallpaper_by_aksensei_dg29l08-fullview.jpg";

interface LandingPageProps {
  onStartClick: () => void;
}

export default function LandingPage({ onStartClick }: LandingPageProps) {
  const { playRandomMagicSound } = useSound();
  const [, setLocation] = useLocation();

  const handleStartClick = useCallback(() => {
    playRandomMagicSound();
    onStartClick();
  }, [onStartClick, playRandomMagicSound]);
  
  const navigateToSpectator = useCallback(() => {
    playRandomMagicSound();
    setLocation('/spectator');
  }, [playRandomMagicSound, setLocation]);

  return (
    <motion.div
      className="min-h-screen w-full bg-cover bg-center relative flex flex-col items-center justify-center"
      style={{ backgroundImage: `url(${backgroundImage})` }}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="absolute inset-0 bg-hogwarts-dark bg-opacity-50" />
      
      {/* Logo and Title */}
      <motion.div 
        className="relative z-10 text-center mb-12"
        variants={fadeUp}
        custom={0.3}
      >
        <motion.div
          animate={{ y: [0, -15, 0] }}
          transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
        >
          <FontHarryP
            className="text-hogwarts-gold text-7xl md:text-8xl lg:text-9xl mb-4 text-shadow"
          >
            YLY COMPETITION
          </FontHarryP>
          <FontHarryP className="text-hogwarts-light text-3xl md:text-4xl mb-4">
            make your magic
          </FontHarryP>
        </motion.div>
        <div className="w-full max-w-lg mx-auto h-1 bg-gradient-to-r from-transparent via-hogwarts-gold to-transparent" />
      </motion.div>
      
      {/* Start Magic Button */}
      <motion.div
        variants={fadeUp}
        custom={0.6}
      >
        <div className="flex flex-col space-y-3">
          <Button
            onClick={handleStartClick}
            className="relative z-10 font-[HarryP] text-hogwarts-light bg-hogwarts-dark border-2 border-hogwarts-gold rounded-md px-10 py-7 text-2xl md:text-3xl tracking-wide hover:scale-105 transition-all duration-300 magic-glow shadow-glow"
            style={{ 
              background: "url('https://i.pinimg.com/originals/e1/78/2a/e1782a75fb6fd87bf0a5ccc6e2e5b4d8.jpg')",
              backgroundSize: 'cover',
              backgroundPosition: 'center'
            }}
          >
            START MAGIC
          </Button>
          
          <Button
            onClick={navigateToSpectator}
            className="relative z-10 font-[HarryP] text-hogwarts-light bg-hogwarts-blue/80 border-2 border-hogwarts-gold rounded-md px-6 py-4 text-xl md:text-2xl tracking-wide hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-tv mr-2"></i> SPECTATOR MODE
          </Button>
        </div>
      </motion.div>
      
      {/* Floating Particles */}
      <MagicParticles count={70} />
      
      {/* YouTube Music Player now moved to App.tsx */}
    </motion.div>
  );
}
