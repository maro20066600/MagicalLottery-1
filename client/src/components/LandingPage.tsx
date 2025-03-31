import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FontHarryP } from "@/components/ui/font-harry-p";
import MagicParticles from "@/components/MagicParticles";
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
        <FontHarryP
          className="text-hogwarts-blue text-7xl md:text-8xl lg:text-9xl mb-4 animate-float text-shadow"
        >
          YLY COMPETITION
        </FontHarryP>
        <div className="w-full max-w-lg mx-auto h-1 bg-gradient-to-r from-transparent via-hogwarts-gold to-transparent" />
      </motion.div>
      
      {/* Start Magic Button */}
      <motion.div
        variants={fadeUp}
        custom={0.6}
      >
        <Button
          onClick={handleStartClick}
          className="relative z-10 font-[HarryP] text-hogwarts-light bg-hogwarts-blue border-2 border-hogwarts-gold rounded-full px-10 py-7 text-2xl md:text-3xl tracking-wide hover:scale-105 transition-all duration-300 magic-glow shadow-glow"
        >
          START MAGIC
        </Button>
      </motion.div>
      
      {/* Floating Particles */}
      <MagicParticles count={70} />
    </motion.div>
  );
}
