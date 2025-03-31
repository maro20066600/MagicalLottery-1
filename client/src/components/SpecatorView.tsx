import { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FontHarryP } from "@/components/ui/font-harry-p";
import { useQuery } from "@tanstack/react-query";
import { Governorate, Group } from "@shared/schema";
import { fadeIn } from "@/lib/animations";
import { useLocation } from "wouter";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function SpectatorView() {
  const [activeGroupIndex, setActiveGroupIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [, setLocation] = useLocation();

  // Fetch governorates data
  const { data: governorates, isLoading: isLoadingGovernorates } = useQuery<Governorate[]>({
    queryKey: ['/api/governorates'],
    refetchInterval: 3000 // Auto refresh every 3 seconds
  });

  // Fetch groups data
  const { data: groups, isLoading: isLoadingGroups } = useQuery<Group[]>({
    queryKey: ['/api/groups'],
    refetchInterval: 3000 // Auto refresh every 3 seconds
  });

  // Auto-cycle through groups every 15 seconds
  useEffect(() => {
    if (!groups || groups.length <= 1) return;
    
    const intervalId = setInterval(() => {
      setActiveGroupIndex(current => (current + 1) % groups.length);
    }, 15000);
    
    return () => clearInterval(intervalId);
  }, [groups]);
  
  // Toggle fullscreen mode
  const toggleFullscreen = useCallback(() => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  }, []);
  
  // Toggle help overlay
  const toggleHelp = useCallback(() => {
    setShowHelp(current => !current);
  }, []);

  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // ESC key to exit fullscreen or close help
      if (e.key === 'Escape') {
        if (showHelp) {
          setShowHelp(false);
        } else if (document.fullscreenElement) {
          document.exitFullscreen();
          setIsFullscreen(false);
        }
      }
      
      // F key to toggle fullscreen
      if (e.key === 'f' || e.key === 'F') {
        toggleFullscreen();
      }
      
      // H key to toggle help
      if (e.key === 'h' || e.key === 'H') {
        toggleHelp();
      }
      
      // Arrow keys to navigate groups
      if (e.key === 'ArrowRight' && groups) {
        setActiveGroupIndex(current => (current + 1) % groups.length);
      }
      if (e.key === 'ArrowLeft' && groups) {
        setActiveGroupIndex(current => 
          current === 0 ? groups.length - 1 : current - 1
        );
      }
      
      // Home key to return to main page
      if (e.key === 'Home') {
        setLocation('/');
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [groups, toggleFullscreen, toggleHelp, showHelp, setLocation]);

  // Group governorates by their assigned group
  const governoratesByGroup = useMemo(() => {
    const result: Record<number, Governorate[]> = {};
    
    if (groups && governorates) {
      groups.forEach(group => {
        result[group.id] = governorates.filter(gov => gov.groupId === group.id);
      });
    }
    
    return result;
  }, [groups, governorates]);

  // Get active group
  const activeGroup = groups?.[activeGroupIndex];

  // Loading state
  if (isLoadingGroups || isLoadingGovernorates) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hogwarts-dark">
        <div className="text-center">
          <Loader2 className="h-16 w-16 animate-spin text-hogwarts-gold mx-auto mb-8" />
          <FontHarryP className="text-hogwarts-blue text-4xl">
            Loading Magical Display...
          </FontHarryP>
        </div>
      </div>
    );
  }

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
      className="min-h-screen bg-cover bg-center relative pb-16"
      style={{ backgroundImage: "url('https://images.unsplash.com/photo-1478720568477-152d9b164e26?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D')" }}
      initial="hidden"
      animate="visible"
      variants={fadeIn}
    >
      <div className="absolute inset-0 bg-hogwarts-dark bg-opacity-70" />
      
      {/* Header */}
      <header className="relative z-10 text-center py-8">
        <FontHarryP className="text-hogwarts-blue text-6xl md:text-7xl lg:text-8xl mb-2">
          YLY COMPETITION
        </FontHarryP>
        <FontHarryP className="text-hogwarts-light text-3xl md:text-4xl lg:text-5xl">
          make your magic
        </FontHarryP>
        <div className="w-full max-w-xl mx-auto h-1 bg-gradient-to-r from-transparent via-hogwarts-red to-transparent mt-4" />
      </header>
      
      {/* Spectator View Controls */}
      <div className="relative z-10 container mx-auto px-4 py-4 flex justify-between items-center">
        <div className="flex space-x-4">
          <Button
            onClick={() => setLocation('/')}
            variant="outline" 
            className="bg-hogwarts-dark/50 border-hogwarts-gold text-hogwarts-light hover:bg-hogwarts-dark"
          >
            <i className="fas fa-arrow-left mr-2"></i> Exit Spectator
          </Button>
          <Button
            onClick={toggleFullscreen}
            variant="outline" 
            className="bg-hogwarts-dark/50 border-hogwarts-gold text-hogwarts-light hover:bg-hogwarts-dark"
          >
            <i className={`fas ${isFullscreen ? 'fa-compress' : 'fa-expand'} mr-2`}></i>
            {isFullscreen ? 'Exit Fullscreen' : 'Enter Fullscreen'}
          </Button>
          
          <Button
            onClick={toggleHelp}
            variant="outline" 
            className="bg-hogwarts-dark/50 border-hogwarts-gold text-hogwarts-light hover:bg-hogwarts-dark"
          >
            <i className="fas fa-question-circle mr-2"></i>
            Help
          </Button>
        </div>
        
        {groups && groups.length > 0 && (
          <div className="flex space-x-2 overflow-x-auto hide-scrollbar">
            {groups.map((group, index) => (
              <Button
                key={group.id}
                variant={activeGroupIndex === index ? "default" : "ghost"}
                className={`px-3 py-2 ${activeGroupIndex === index ? 'bg-hogwarts-blue text-white' : 'text-hogwarts-light hover:bg-hogwarts-dark/30'}`}
                onClick={() => setActiveGroupIndex(index)}
              >
                <i className={`fas ${getGroupIcon(group.name)} mr-2`}></i>
                {group.name}
              </Button>
            ))}
          </div>
        )}
      </div>
      
      {/* Active Group Display - Zoomed in for large screens */}
      <main className="relative z-10 container mx-auto px-4 py-8">
        <AnimatePresence mode="wait">
          {activeGroup && (
            <motion.div
              key={activeGroup.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center"
            >
              {/* Group Title */}
              <div className="mb-8 flex items-center justify-center">
                <i className={`fas ${getGroupIcon(activeGroup.name)} text-5xl md:text-6xl text-hogwarts-gold mr-4`}></i>
                <FontHarryP className="text-5xl md:text-6xl text-hogwarts-gold">
                  {activeGroup.name}
                </FontHarryP>
              </div>
              
              {/* Governorates in this group - Big for visibility */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                {governoratesByGroup[activeGroup.id]?.map((governorate) => {
                  const styles = getGroupStyles(activeGroup.theme);
                  
                  return (
                    <motion.div
                      key={governorate.id}
                      className={`border-4 ${styles.border} rounded-xl p-6 bg-gradient-to-b ${styles.bg} backdrop-blur-sm shadow-xl transform`}
                      whileHover={{ scale: 1.05 }}
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ 
                        scale: 1, 
                        opacity: 1,
                        borderColor: governorate.revealed ? 'rgb(234, 179, 8)' : undefined
                      }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="flex items-center justify-center mb-4">
                        <i className={`fas fa-map-marker-alt text-4xl ${styles.text}`}></i>
                      </div>
                      <div className="text-center">
                        <FontHarryP className={`text-4xl ${governorate.revealed ? 'text-hogwarts-gold animate-pulse text-shadow' : 'text-hogwarts-light'} mb-2`}>
                          {governorate.name}
                        </FontHarryP>
                        <div className={`w-full h-1 bg-gradient-to-r from-transparent via-${governorate.revealed ? 'hogwarts-gold' : styles.text} to-transparent mt-2`} />
                        {governorate.revealed && (
                          <div className="mt-4">
                            <i className="fas fa-wand-sparkles text-hogwarts-gold text-3xl animate-magic-glow"></i>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>
      
      {/* Footer with pagination indicators */}
      <footer className="fixed bottom-0 left-0 right-0 py-4 bg-hogwarts-dark/70 backdrop-blur-sm z-20">
        <div className="container mx-auto flex justify-center">
          {groups?.map((group, index) => (
            <button
              key={group.id}
              onClick={() => setActiveGroupIndex(index)}
              className={`w-4 h-4 mx-2 rounded-full ${activeGroupIndex === index ? 'bg-hogwarts-gold' : 'bg-hogwarts-light opacity-50'}`}
              aria-label={`View group ${group.name}`}
            />
          ))}
        </div>
      </footer>
      
      {/* Help Overlay */}
      <AnimatePresence>
        {showHelp && (
          <motion.div 
            className="fixed inset-0 bg-hogwarts-dark/80 backdrop-blur-md z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <div className="max-w-3xl w-full bg-hogwarts-dark/90 border-2 border-hogwarts-gold rounded-xl p-8 text-hogwarts-light">
              <div className="flex justify-between items-center mb-6">
                <FontHarryP className="text-4xl text-hogwarts-blue">Spectator Mode Controls</FontHarryP>
                <Button 
                  variant="ghost" 
                  onClick={toggleHelp}
                  className="text-hogwarts-light hover:text-hogwarts-gold"
                >
                  <i className="fas fa-times text-2xl"></i>
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-xl font-bold text-hogwarts-gold mb-3">Keyboard Shortcuts</h3>
                  <ul className="space-y-3">
                    <li className="flex items-center">
                      <span className="bg-hogwarts-dark border border-hogwarts-gold px-2 py-1 rounded mr-3">F</span>
                      <span>Toggle fullscreen mode</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-hogwarts-dark border border-hogwarts-gold px-2 py-1 rounded mr-3">H</span>
                      <span>Show/hide this help screen</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-hogwarts-dark border border-hogwarts-gold px-2 py-1 rounded mr-3">←</span>
                      <span>Previous group</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-hogwarts-dark border border-hogwarts-gold px-2 py-1 rounded mr-3">→</span>
                      <span>Next group</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-hogwarts-dark border border-hogwarts-gold px-2 py-1 rounded mr-3">ESC</span>
                      <span>Exit fullscreen or close help</span>
                    </li>
                    <li className="flex items-center">
                      <span className="bg-hogwarts-dark border border-hogwarts-gold px-2 py-1 rounded mr-3">Home</span>
                      <span>Return to main page</span>
                    </li>
                  </ul>
                </div>
                
                <div>
                  <h3 className="text-xl font-bold text-hogwarts-gold mb-3">About Spectator Mode</h3>
                  <p className="mb-4">Designed for viewing on large screens during the YLY COMPETITION event. Groups will automatically cycle every 15 seconds.</p>
                  
                  <h3 className="text-xl font-bold text-hogwarts-gold mb-3 mt-6">Tips</h3>
                  <ul className="space-y-2">
                    <li>• Use fullscreen mode for the best viewing experience</li>
                    <li>• Groups auto-cycle every 15 seconds</li>
                    <li>• Click on any dot at the bottom to jump to a specific group</li>
                    <li>• Watch for animated effects when governorates are revealed</li>
                  </ul>
                </div>
              </div>
              
              <div className="mt-8 text-center">
                <Button
                  onClick={toggleHelp}
                  className="bg-hogwarts-dark border-2 border-hogwarts-gold text-hogwarts-light hover:bg-hogwarts-dark/70 px-8 py-2"
                >
                  Close Help
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}