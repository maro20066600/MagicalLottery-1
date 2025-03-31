import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FontHarryP } from "@/components/ui/font-harry-p";
import MagicCard from "@/components/MagicCard";
import { useSound } from "@/hooks/use-sound";
import { fadeIn } from "@/lib/animations";
import ResultsModal from "@/components/ResultsModal";
import { apiRequest } from "@/lib/queryClient";
import { useMutation, useQuery } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Governorate, Group } from "@shared/schema";
import { Loader2 } from "lucide-react";

interface LotteryPageProps {}

export default function LotteryPage({}: LotteryPageProps) {
  const [showResults, setShowResults] = useState(false);
  const [isLotteryStarted, setIsLotteryStarted] = useState(false);
  const [revealedCount, setRevealedCount] = useState(0);
  const { playRandomMagicSound } = useSound();

  // Fetch governorates data
  const { data: governorates, isLoading: isLoadingGovernorates } = useQuery<Governorate[]>({
    queryKey: ['/api/governorates'],
  });

  // Fetch groups data
  const { data: groups, isLoading: isLoadingGroups } = useQuery<Group[]>({
    queryKey: ['/api/groups'],
  });

  // Start lottery mutation
  const startLotteryMutation = useMutation({
    mutationFn: async () => {
      const response = await apiRequest('POST', '/api/lottery/start', {});
      return await response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/governorates'] });
      setIsLotteryStarted(true);
    },
  });

  // Reveal card mutation
  const revealCardMutation = useMutation({
    mutationFn: async (governorateId: number) => {
      const response = await apiRequest('POST', `/api/lottery/reveal/${governorateId}`, {});
      return await response.json();
    },
    onSuccess: () => {
      playRandomMagicSound();
      setRevealedCount(prev => prev + 1);
      queryClient.invalidateQueries({ queryKey: ['/api/governorates'] });
    },
  });

  // Handle clicking the start lottery button
  const handleStartLottery = useCallback(() => {
    playRandomMagicSound();
    startLotteryMutation.mutate();
  }, [playRandomMagicSound, startLotteryMutation]);

  // Handle clicking on a card
  const handleCardClick = useCallback((governorate: Governorate) => {
    if (!isLotteryStarted || governorate.revealed) return;
    revealCardMutation.mutate(governorate.id);
  }, [isLotteryStarted, revealCardMutation]);

  // Show results when all cards are revealed
  useEffect(() => {
    if (governorates && revealedCount === governorates.length && revealedCount > 0) {
      const timer = setTimeout(() => {
        setShowResults(true);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [revealedCount, governorates]);

  const isLoading = isLoadingGovernorates || isLoadingGroups || startLotteryMutation.isPending;

  return (
    <motion.div
      className="min-h-screen bg-cover bg-center relative"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="absolute inset-0 bg-hogwarts-dark bg-opacity-70" />
      
      {/* Header Section */}
      <header className="relative z-10 text-center py-8">
        <FontHarryP className="text-hogwarts-gold text-4xl md:text-5xl lg:text-6xl mb-2">
          The Magical Lottery
        </FontHarryP>
        <FontHarryP className="text-hogwarts-light text-2xl md:text-3xl">
          for Egyptian Governorates
        </FontHarryP>
        <div className="w-full max-w-xl mx-auto h-1 bg-gradient-to-r from-transparent via-hogwarts-red to-transparent mt-4" />
      </header>
      
      {/* Main Lottery Cards */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex justify-center mb-8">
          <Button
            onClick={handleStartLottery}
            disabled={isLotteryStarted || isLoading}
            className="font-[HarryP] text-hogwarts-light bg-hogwarts-blue border-2 border-hogwarts-gold rounded-full px-8 py-6 text-xl md:text-2xl tracking-wide hover:scale-105 transition-all duration-300 magic-glow disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Loading...
              </>
            ) : (
              <>
                <i className="fas fa-wand-sparkles mr-2"></i> Start the Magic Lottery
              </>
            )}
          </Button>
        </div>
        
        {/* Lottery Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {governorates?.map((governorate) => (
            <MagicCard
              key={governorate.id}
              governorate={governorate}
              onClick={() => handleCardClick(governorate)}
              isRevealed={governorate.revealed}
            />
          ))}
        </div>
      </main>

      {/* Results Modal */}
      <AnimatePresence>
        {showResults && groups && (
          <ResultsModal
            onClose={() => setShowResults(false)}
            onRedraw={() => {
              setShowResults(false);
              setIsLotteryStarted(false);
              setRevealedCount(0);
              queryClient.invalidateQueries({ queryKey: ['/api/lottery/reset'] });
            }}
            groups={groups}
            governorates={governorates || []}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
}
