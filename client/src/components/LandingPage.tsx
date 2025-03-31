import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FontHarryP } from "@/components/ui/font-harry-p";
import MagicParticles from "@/components/MagicParticles";
import YouTubePlayer from "@/components/YouTubePlayer";
import { useSound } from "@/hooks/use-sound";
import { fadeUp, fadeIn } from "@/lib/animations";
import { useCallback } from "react";
import backgroundImage from "@assets/hogwarts_legacy___ever_edition_4k_wallpaper_by_aksensei_dg29l08-fullview.jpg";

interface LandingPageProps {
  onStartClick: () => void;
}

export default function LandingPage({ onStartClick }: LandingPageProps) {
  const { playRandomMagicSound } = useSound();

  const handleStartClick = useCallback(() => {
    playRandomMagicSound();
    onStartClick();
  }, [onStartClick, playRandomMagicSound]);

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
            className="text-blue-500 text-7xl md:text-8xl lg:text-9xl mb-4 text-shadow"
          >
            YLY COMPETITION
          </FontHarryP>
        </motion.div>
        <div className="w-full max-w-lg mx-auto h-1 bg-gradient-to-r from-transparent via-hogwarts-gold to-transparent" />
      </motion.div>
      
      {/* Start Magic Button */}
      <motion.div
        variants={fadeUp}
        custom={0.6}
      >
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
      </motion.div>
      
      {/* Floating Particles */}
      <MagicParticles count={70} />
      
      {/* YouTube Music Player now moved to App.tsx */}
    </motion.div>
  );
}
