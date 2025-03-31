import { motion } from 'framer-motion';
import { Governorate } from '@shared/schema';
import { FontHarryP } from '@/components/ui/font-harry-p';
import { Card } from '@/components/ui/card';

interface MagicCardProps {
  governorate: Governorate;
  isRevealed: boolean;
  onClick: () => void;
}

export default function MagicCard({ governorate, isRevealed, onClick }: MagicCardProps) {
  // Icons for different governorates (or default to landmark)
  const getGovernorateIcon = (name: string) => {
    const icons: Record<string, string> = {
      'Cairo': 'fa-landmark',
      'Alexandria': 'fa-mosque',
      'Aswan': 'fa-mountain',
      'Port Said': 'fa-water',
      'Fayoum': 'fa-seedling',
      'Ministry Team': 'fa-lightbulb',
      'Capital': 'fa-building',
      '5G': 'fa-wifi'
    };
    
    return icons[name] || 'fa-landmark';
  };

  return (
    <motion.div
      className={`card-flip ${isRevealed ? 'is-flipped' : ''}`}
      whileHover={{ scale: isRevealed ? 1 : 1.03 }}
      onClick={!isRevealed ? onClick : undefined}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="relative w-full h-64 perspective">
        <div className={`card-inner w-full h-full transition-transform duration-500 ${isRevealed ? 'rotate-y-180' : ''}`}>
          {/* Card Front */}
          <div className="card-front absolute inset-0 bg-gradient-to-br from-hogwarts-blue to-hogwarts-dark rounded-lg border-2 border-hogwarts-gold p-4 flex flex-col items-center justify-center backface-hidden">
            <motion.div 
              className="text-6xl text-hogwarts-gold mb-4"
              animate={{ y: [0, 15, 0] }}
              transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
            >
              ?
            </motion.div>
            <p className="font-serif text-lg text-hogwarts-light">Click to reveal governorate</p>
            <div className="absolute inset-0 rounded-lg bg-radial-glow" />
          </div>
          
          {/* Card Back */}
          <div className="card-back absolute inset-0 bg-hogwarts-light rounded-lg border-2 border-hogwarts-gold p-4 flex flex-col items-center justify-center backface-hidden rotate-y-180">
            <div className="w-16 h-16 flex items-center justify-center mb-3">
              <i className={`fas ${getGovernorateIcon(governorate.name)} text-4xl text-hogwarts-blue`}></i>
            </div>
            <FontHarryP className="text-2xl text-hogwarts-blue mb-1 text-center">
              {governorate.name}
            </FontHarryP>
            {governorate.groupName && (
              <p className="font-serif text-sm text-hogwarts-dark text-center">
                Group: <span className="font-bold text-hogwarts-red">{governorate.groupName}</span>
              </p>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
