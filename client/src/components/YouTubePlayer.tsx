import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

declare global {
  interface Window {
    YT: any;
    onYouTubeIframeAPIReady: () => void;
  }
}

export default function YouTubePlayer() {
  const [player, setPlayer] = useState<any>(null);
  const [playerReady, setPlayerReady] = useState(false);

  useEffect(() => {
    // This function will be called once the YouTube IFrame API is ready
    window.onYouTubeIframeAPIReady = () => {
      const newPlayer = new window.YT.Player('ytplayer', {
        height: '360',
        width: '640',
        videoId: '7gswtbX8G7Q', // Harry Potter theme music
        playerVars: {
          autoplay: 1,
          loop: 1,
          playlist: '7gswtbX8G7Q',
          controls: 0
        },
        events: {
          'onReady': (event: any) => {
            // Set player volume to a lower level to not overwhelm the UI sounds
            newPlayer.setVolume(30);
            // Start playing automatically
            event.target.playVideo();
            setPlayerReady(true);
            setPlayer(newPlayer);
          }
        }
      });
    };

    // Load the YouTube IFrame API
    const tag = document.createElement('script');
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName('script')[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    // Cleanup function
    return () => {
      window.onYouTubeIframeAPIReady = () => {};
      if (player && typeof player.destroy === 'function') {
        player.destroy();
      }
    };
  }, []);

  const playMusic = () => {
    if (player && playerReady) {
      player.playVideo();
    }
  };

  const pauseMusic = () => {
    if (player && playerReady) {
      player.pauseVideo();
    }
  };

  return (
    <div className="fixed top-4 left-4 z-50 flex gap-2">
      <div id="ytplayer" className="w-1 h-1 opacity-0 overflow-hidden"></div>
      <Button 
        onClick={playMusic} 
        size="sm" 
        className="bg-hogwarts-gold text-black hover:bg-hogwarts-gold/80 font-bold"
      >
        <i className="fas fa-music mr-1"></i> تشغيل
      </Button>
      <Button 
        onClick={pauseMusic} 
        size="sm" 
        className="bg-hogwarts-red text-white hover:bg-hogwarts-red/80 font-bold"
      >
        <i className="fas fa-pause mr-1"></i> إيقاف
      </Button>
    </div>
  );
}