import { useState, useEffect } from "react";
import LandingPage from "@/components/LandingPage";
import LotteryPage from "@/components/LotteryPage";
import { motion, AnimatePresence } from "framer-motion";
import { useSound } from "@/hooks/use-sound";
import { useQuery } from "@tanstack/react-query";

export default function Home() {
  const [currentPage, setCurrentPage] = useState<"landing" | "lottery">("landing");
  const { playBackgroundMusic } = useSound();

  // Initialize app data
  const { refetch: initApp } = useQuery({
    queryKey: ['/api/init'],
    enabled: false, // Don't run this query on component mount
  });

  // Initialize app when loaded
  useEffect(() => {
    initApp();
  }, [initApp]);

  // Play background music on user interaction
  useEffect(() => {
    const handleUserInteraction = () => {
      playBackgroundMusic();
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };

    window.addEventListener("click", handleUserInteraction);
    window.addEventListener("touchstart", handleUserInteraction);

    return () => {
      window.removeEventListener("click", handleUserInteraction);
      window.removeEventListener("touchstart", handleUserInteraction);
    };
  }, [playBackgroundMusic]);

  return (
    <div className="min-h-screen w-full overflow-x-hidden">
      <AnimatePresence mode="wait">
        {currentPage === "landing" && (
          <motion.div
            key="landing"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
          >
            <LandingPage onStartClick={() => setCurrentPage("lottery")} />
          </motion.div>
        )}

        {currentPage === "lottery" && (
          <motion.div
            key="lottery"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <LotteryPage />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
