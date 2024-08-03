import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import Sound from 'react-native-sound';
import { SoundKey, SOUND_KEYS } from './SoundKeys';
import BackgroundTimer from 'react-native-background-timer';

export type SoundContextType = {
  playSound: (soundName: SoundKey, skipWait?: boolean) => void;
};

const defaultValue: SoundContextType = {
  playSound: () => {
    console.log('Default playSound function');
  },
};

// Create the context with the default value
const SoundContext = createContext<SoundContextType>(defaultValue);

// A functional component to manage sounds
const useSoundManager = () => {
  const [sounds, setSounds] = useState<Record<string, Sound>>({});
  const isPlayingRef = useRef(false);

  // Generic onmount useEffect to initialize sounds
  useEffect(() => {
    const initializedSounds: Record<string, Sound> = SOUND_KEYS.reduce((acc, key) => {
      acc[key] = new Sound(`${key}.mp3`, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log(`Failed to load the sound ${key}`, error);
        } else {
          //Modify the sound -> lowering volume
          acc[key].setVolume(0.5);
        }
      });
      return acc;
    }, {});

    setSounds(initializedSounds);

    // Cleanup function to release the sound resources
    return () => {
      Object.values(initializedSounds).forEach((sound) => {
        sound.release();
      });
    };
  }, []);

  const playSound = async (key: SoundKey, skipWait: boolean = false) => {
    //Function to help with delaying the sound until a previous sound is finished
    const waitForSoundToFinish = (): Promise<void> => {
      return new Promise((resolve) => {
        const checkInterval = BackgroundTimer.setInterval(() => {
          if (!isPlayingRef.current) {
            BackgroundTimer.clearInterval(checkInterval);
            resolve();
          }
        }, 100); // Check every 10th of a second
      });
    };

    if (isPlayingRef.current === true && !skipWait) {
      await waitForSoundToFinish();
    }

    if (sounds[key]) {
      isPlayingRef.current = true;
      sounds[key].play((success) => {
        isPlayingRef.current = false;
        if (!success) {
          console.log('Playback failed due to audio decoding errors');
        }
      });
    }
  };

  return { playSound };
};

// Provider component
export const SoundProvider = ({ children }) => {
  const soundManager = useSoundManager();

  return <SoundContext.Provider value={soundManager}>{children}</SoundContext.Provider>;
};

// Custom hook to use the SoundContext
export const useSound = () => useContext(SoundContext);
