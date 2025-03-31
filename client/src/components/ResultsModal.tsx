import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { FontHarryP } from "@/components/ui/font-harry-p";
import { useSound } from "@/hooks/use-sound";
import { Governorate, Group } from "@shared/schema";
import { useCallback } from "react";
import { X } from "lucide-react";

interface ResultsModalProps {
  onClose: () => void;
  onRedraw: () => void;
  groups: Group[];
  governorates: Governorate[];
}

export default function ResultsModal({ onClose, onRedraw, groups, governorates }: ResultsModalProps) {
  const { playRandomMagicSound } = useSound();

  const handleRedraw = useCallback(() => {
    playRandomMagicSound();
    onRedraw();
  }, [onRedraw, playRandomMagicSound]);

  const handlePrintResults = useCallback(() => {
    playRandomMagicSound();
    window.print();
  }, [playRandomMagicSound]);

  // Get the governorates for a specific group
  const getGovernoratesForGroup = useCallback((groupId: number) => {
    return governorates.filter(gov => gov.groupId === groupId);
  }, [governorates]);

  // Get the icon for a group
  const getGroupIcon = (groupName: string) => {
    const icons: Record<string, string> = {
      'Singing': 'fa-microphone',
      'Theater': 'fa-masks-theater',
      'Presentation': 'fa-person-chalkboard',
      'Sports': 'fa-volleyball',
      'Culture': 'fa-building-columns',
      'Arts': 'fa-palette',
      'Creativity': 'fa-lightbulb',
      'Literature': 'fa-book',
      'Innovation': 'fa-rocket'
    };
    
    return icons[groupName] || 'fa-star';
  };

  // Get color styles for a group
  const getGroupStyles = (theme: string) => {
    const themes: Record<string, { bg: string, border: string, text: string, starColor: string }> = {
      'red-gold': { 
        bg: 'from-hogwarts-red/20 to-transparent', 
        border: 'border-hogwarts-gold', 
        text: 'text-hogwarts-red',
        starColor: 'text-hogwarts-gold'
      },
      'blue-silver': { 
        bg: 'from-hogwarts-blue/20 to-transparent', 
        border: 'border-gray-300', 
        text: 'text-hogwarts-blue',
        starColor: 'text-gray-400'
      },
      'green-silver': { 
        bg: 'from-green-700/20 to-transparent', 
        border: 'border-gray-300', 
        text: 'text-green-700',
        starColor: 'text-gray-400'
      },
      'yellow-black': { 
        bg: 'from-yellow-600/20 to-transparent', 
        border: 'border-hogwarts-dark', 
        text: 'text-yellow-600',
        starColor: 'text-hogwarts-dark'
      },
      'purple-gold': { 
        bg: 'from-purple-700/20 to-transparent', 
        border: 'border-hogwarts-gold', 
        text: 'text-purple-700',
        starColor: 'text-hogwarts-gold'
      },
      'light-blue-silver': { 
        bg: 'from-sky-500/20 to-transparent', 
        border: 'border-gray-300', 
        text: 'text-sky-500',
        starColor: 'text-gray-400'
      },
      'dark-green-gold': { 
        bg: 'from-emerald-800/20 to-transparent', 
        border: 'border-hogwarts-gold', 
        text: 'text-emerald-800',
        starColor: 'text-hogwarts-gold'
      },
      'burgundy-silver': { 
        bg: 'from-rose-800/20 to-transparent', 
        border: 'border-gray-300', 
        text: 'text-rose-800',
        starColor: 'text-gray-400'
      },
      'black-gold': { 
        bg: 'from-slate-800/20 to-transparent', 
        border: 'border-hogwarts-gold', 
        text: 'text-slate-800',
        starColor: 'text-hogwarts-gold'
      }
    };
    
    return themes[theme] || themes['red-gold'];
  };

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center print:relative print:inset-auto"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <div className="absolute inset-0 bg-hogwarts-dark bg-opacity-80 print:hidden" />
      
      <motion.div
        className="relative z-10 w-full max-w-4xl bg-cover bg-center rounded-lg p-8 max-h-[90vh] overflow-y-auto print:max-h-none print:overflow-visible bg-hogwarts-light"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1524393988855-996e1aef7782?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
      >
        <div className="absolute top-4 right-4 print:hidden">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={onClose}
            className="text-hogwarts-dark hover:text-hogwarts-red transition-colors"
          >
            <X size={24} />
          </Button>
        </div>
        
        <div className="flex justify-center items-center mb-6 px-2">
          <FontHarryP className="text-hogwarts-gold text-3xl text-center">
            YLY COMPETITION RESULTS
          </FontHarryP>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-8">
          {groups.map(group => {
            const govs = getGovernoratesForGroup(group.id);
            const styles = getGroupStyles(group.theme);
            
            return (
              <div 
                key={group.id}
                className={`bg-gradient-to-b ${styles.bg} border-2 ${styles.border} rounded-lg p-4`}
              >
                <div className="flex items-center justify-center mb-4">
                  <i className={`fas ${getGroupIcon(group.name)} text-3xl ${styles.text}`}></i>
                  <FontHarryP className={`text-2xl ${styles.text} ml-3`}>
                    {group.name}
                  </FontHarryP>
                </div>
                <ul className="font-serif text-hogwarts-dark space-y-2">
                  {govs.map(gov => (
                    <li key={gov.id} className="flex items-center">
                      <i className={`fas fa-star ${styles.starColor} mr-2`}></i> {gov.name}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>
        
        <div className="flex justify-center space-x-6 print:hidden">
          <Button 
            onClick={handlePrintResults}
            className="font-[HarryP] text-hogwarts-light bg-hogwarts-blue border-2 border-hogwarts-gold rounded-full px-6 py-4 text-lg tracking-wide hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-print mr-2"></i> Print Results
          </Button>
          <Button 
            onClick={handleRedraw}
            className="font-[HarryP] text-hogwarts-light bg-hogwarts-red border-2 border-hogwarts-gold rounded-full px-6 py-4 text-lg tracking-wide hover:scale-105 transition-all duration-300"
          >
            <i className="fas fa-wand-magic-sparkles mr-2"></i> Draw Again
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}
