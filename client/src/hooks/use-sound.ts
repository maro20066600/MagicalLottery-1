import { useCallback, useMemo } from 'react';
import { Howl } from 'howler';

export function useSound() {
  // Define sound sources
  const magicSounds = useMemo(() => [
    'https://assets.mixkit.co/sfx/preview/mixkit-magical-spell-special-effect-107.mp3',
    'https://assets.mixkit.co/sfx/preview/mixkit-fairy-magic-sparkle-871.mp3',
    'https://assets.mixkit.co/sfx/preview/mixkit-fairy-quick-glitter-spell-875.mp3'
  ], []);

  // Background sound
  const backgroundSound = useMemo(() => new Howl({
    src: ['https://assets.mixkit.co/sfx/preview/mixkit-cinematic-mystery-background-496.mp3'],
    loop: true,
    volume: 0.1,
  }), []);

  // Play a random magic sound
  const playRandomMagicSound = useCallback(() => {
    const randomSoundIndex = Math.floor(Math.random() * magicSounds.length);
    const sound = new Howl({
      src: [magicSounds[randomSoundIndex]],
      volume: 0.3,
    });
    sound.play();
  }, [magicSounds]);

  // Play background music
  const playBackgroundMusic = useCallback(() => {
    if (!backgroundSound.playing()) {
      backgroundSound.play();
    }
  }, [backgroundSound]);

  // Stop background music
  const stopBackgroundMusic = useCallback(() => {
    backgroundSound.stop();
  }, [backgroundSound]);

  return {
    playRandomMagicSound,
    playBackgroundMusic,
    stopBackgroundMusic
  };
}
