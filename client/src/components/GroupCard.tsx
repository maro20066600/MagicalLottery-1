import { useState } from 'react';
import { motion } from 'framer-motion';
import { FontHarryP } from '@/components/ui/font-harry-p';
import { Card, CardContent } from '@/components/ui/card';
import { Governorate, Group } from '@shared/schema';

interface GroupCardProps {
  group: Group;
  governorates: Governorate[];
  onGovernorateClick: (governorate: Governorate) => void;
  isLotteryStarted: boolean;
}

export default function GroupCard({ 
  group, 
  governorates, 
  onGovernorateClick,
  isLotteryStarted 
}: GroupCardProps) {
  // Get styles based on group theme
  const getGroupStyles = (theme: string) => {
    const themes: Record<string, { bg: string, border: string, text: string, accent: string }> = {
      'red-gold': { 
        bg: 'from-hogwarts-red/20 to-transparent', 
        border: 'border-hogwarts-gold', 
        text: 'text-hogwarts-red',
        accent: 'text-hogwarts-gold'
      },
      'blue-silver': { 
        bg: 'from-hogwarts-blue/20 to-transparent', 
        border: 'border-gray-300', 
        text: 'text-hogwarts-blue',
        accent: 'text-gray-400'
      },
      'green-silver': { 
        bg: 'from-green-700/20 to-transparent', 
        border: 'border-gray-300', 
        text: 'text-green-700',
        accent: 'text-gray-400'
      },
      'yellow-black': { 
        bg: 'from-yellow-600/20 to-transparent', 
        border: 'border-hogwarts-dark', 
        text: 'text-yellow-600',
        accent: 'text-hogwarts-dark'
      },
      'purple-gold': { 
        bg: 'from-purple-700/20 to-transparent', 
        border: 'border-hogwarts-gold', 
        text: 'text-purple-700',
        accent: 'text-hogwarts-gold'
      },
      'light-blue-silver': { 
        bg: 'from-sky-500/20 to-transparent', 
        border: 'border-gray-300', 
        text: 'text-sky-500',
        accent: 'text-gray-400'
      },
      'dark-green-gold': { 
        bg: 'from-emerald-800/20 to-transparent', 
        border: 'border-hogwarts-gold', 
        text: 'text-emerald-800',
        accent: 'text-hogwarts-gold'
      },
      'burgundy-silver': { 
        bg: 'from-rose-800/20 to-transparent', 
        border: 'border-gray-300', 
        text: 'text-rose-800',
        accent: 'text-gray-400'
      },
      'black-gold': { 
        bg: 'from-slate-800/20 to-transparent', 
        border: 'border-hogwarts-gold', 
        text: 'text-slate-800',
        accent: 'text-hogwarts-gold'
      }
    };
    
    return themes[theme] || themes['red-gold'];
  };
  
  // Function to get colored background for revealed cards based on group theme
  const getRevealedBackgroundColor = (theme: string) => {
    const backgrounds: Record<string, string> = {
      'red-gold': 'bg-gradient-to-r from-red-800 to-red-700 border-hogwarts-gold text-white',
      'blue-silver': 'bg-gradient-to-r from-blue-800 to-blue-700 border-gray-300 text-white',
      'green-silver': 'bg-gradient-to-r from-green-800 to-green-700 border-gray-300 text-white',
      'yellow-black': 'bg-gradient-to-r from-yellow-700 to-yellow-600 border-hogwarts-dark text-white',
      'purple-gold': 'bg-gradient-to-r from-purple-800 to-purple-700 border-hogwarts-gold text-white',
      'light-blue-silver': 'bg-gradient-to-r from-sky-800 to-sky-700 border-gray-300 text-white',
      'dark-green-gold': 'bg-gradient-to-r from-emerald-800 to-emerald-700 border-hogwarts-gold text-white',
      'burgundy-silver': 'bg-gradient-to-r from-rose-800 to-rose-700 border-gray-300 text-white',
      'black-gold': 'bg-gradient-to-r from-slate-800 to-slate-700 border-hogwarts-gold text-white'
    };
    
    return backgrounds[theme] || 'bg-gradient-to-r from-hogwarts-dark to-hogwarts-dark/80 border-hogwarts-gold text-white';
  };

  const styles = getGroupStyles(group.theme);

  return (
    <motion.div
      className={`bg-gradient-to-b ${styles.bg} border-2 ${styles.border} rounded-lg p-4 h-full`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <div className="flex items-center justify-center mb-4">
        <i className={`fas ${group.icon} text-3xl ${styles.text}`}></i>
        <FontHarryP className={`text-2xl ${styles.text} mr-3`}>
          {group.name}
        </FontHarryP>
      </div>
      
      <div className="grid grid-cols-1 gap-3">
        {governorates.map((governorate) => (
          <motion.div 
            key={governorate.id}
            onClick={() => isLotteryStarted && onGovernorateClick(governorate)}
            className={`relative p-4 border-2 rounded-lg transition-all duration-300 
                      ${isLotteryStarted && !governorate.revealed ? 'cursor-pointer' : ''}
                      ${governorate.revealed 
                        ? getRevealedBackgroundColor(group.theme) 
                        : 'bg-gradient-to-r from-hogwarts-dark/80 to-hogwarts-dark/50 border-hogwarts-dark hover:border-hogwarts-gold'}
            `}
            whileHover={!governorate.revealed ? { scale: 1.03, rotate: 1 } : {}}
            animate={governorate.revealed ? 
              { scale: [1, 1.05, 1], rotateY: [0, 180, 360], opacity: [0.7, 1] } 
              : {}
            }
            transition={{ duration: 1.2, ease: "easeInOut" }}
          >
            <div className="flex items-center justify-center">
              {governorate.revealed ? (
                <div className="text-center">
                  <i className="fas fa-wand-sparkles text-2xl text-hogwarts-gold mb-2"></i>
                  <div className="text-lg font-bold text-white">{governorate.name}</div>
                  <div className="mt-1 text-sm text-hogwarts-gold">
                    <i className="fas fa-hat-wizard mr-1"></i> {group.name}
                  </div>
                  <div className="mt-2 text-xs text-gray-200">{group.theme.split('-').join(' | ')}</div>
                </div>
              ) : (
                <div className="text-center py-2">
                  <i className="fas fa-magic text-3xl text-hogwarts-gold animate-pulse mb-2"></i>
                  <div className="text-hogwarts-light font-medium">اضغط لكشف السحر</div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
