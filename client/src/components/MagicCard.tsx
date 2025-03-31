
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Governorate } from '@shared/schema';

interface MagicCardProps {
  governorate: Governorate;
  onClick: () => void;
  isRevealed: boolean;
  isLotteryStarted: boolean;
  groupName?: string;
  className?: string;
}

export default function MagicCard({
  governorate,
  onClick,
  isRevealed,
  isLotteryStarted,
  groupName,
  className
}: MagicCardProps) {
  const [isShuffling, setIsShuffling] = useState(false);
  const [displayName, setDisplayName] = useState(governorate.name);
  const [shuffleCount, setShuffleCount] = useState(0);
  const allGovernorates = [
    "القاهرة", "الإسكندرية", "الجيزة", "القليوبية", "الشرقية",
    "الدقهلية", "البحيرة", "المنيا", "سوهاج", "أسيوط",
    "الغربية", "كفر الشيخ", "المنوفية", "بني سويف", "الفيوم"
  ];

  const handleClick = async () => {
    if (!isLotteryStarted || isRevealed || isShuffling) return;
    
    setIsShuffling(true);
    let count = 0;
    const shuffleInterval = setInterval(() => {
      setDisplayName(allGovernorates[Math.floor(Math.random() * allGovernorates.length)]);
      count++;
      setShuffleCount(count);
      if (count >= 10) {
        clearInterval(shuffleInterval);
        setDisplayName(governorate.name);
        setIsShuffling(false);
        onClick();
      }
    }, 200);
  };

  return (
    <motion.div
      className={cn(
        "relative cursor-pointer perspective-1000",
        className
      )}
      onClick={handleClick}
      whileHover={{ scale: isLotteryStarted && !isRevealed ? 1.05 : 1 }}
      animate={{
        rotateY: isRevealed ? 180 : 0,
        scale: isShuffling ? 1.1 : 1
      }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <div className={cn(
        "w-full aspect-[3/4] rounded-xl shadow-xl transition-all duration-500",
        "bg-gradient-to-br from-hogwarts-gold/20 to-hogwarts-gold/40",
        "border-2 border-hogwarts-gold",
        isRevealed ? "opacity-0" : "opacity-100",
        isLotteryStarted && !isRevealed ? "hover:shadow-hogwarts-gold/50 hover:shadow-lg" : ""
      )}>
        <div className="flex flex-col items-center justify-center h-full p-4 text-center">
          <h3 className="font-[HarryP] text-2xl text-hogwarts-light mb-2">
            {isShuffling ? displayName : governorate.name}
          </h3>
          <div className="w-16 h-16 mb-2">
            <img
              src="/wand-sparkles-solid.svg"
              alt="Magic Wand"
              className="w-full h-full object-contain"
            />
          </div>
        </div>
      </div>

      <div className={cn(
        "absolute inset-0 w-full aspect-[3/4] rounded-xl shadow-xl",
        "bg-gradient-to-br from-hogwarts-blue to-hogwarts-dark",
        "border-2 border-hogwarts-gold rotateY-180 backface-hidden",
        "flex flex-col items-center justify-center p-4 text-center"
      )}>
        <h3 className="font-[HarryP] text-2xl text-hogwarts-light mb-2">
          {governorate.name}
        </h3>
        <p className="font-[HarryP] text-xl text-hogwarts-gold">
          {groupName}
        </p>
      </div>
    </motion.div>
  );
}
