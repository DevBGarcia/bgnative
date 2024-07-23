import React, { createContext, useContext, useEffect, useState } from 'react';
import Sound from 'react-native-sound';
import { SoundKey, SOUND_KEYS } from './SoundKeys';

export type SoundContextType = {
  playSound: (soundName: SoundKey) => void;
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
  const [sounds, setSounds] = useState({});

  // Generic onmount useEffect to initialize sounds
  useEffect(() => {
    const initializedSounds: Record<string, Sound> = SOUND_KEYS.reduce((acc, key) => {
      acc[key] = new Sound(`${key}.mp3`, Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log(`Failed to load the sound ${key}`, error);
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

  const playSound = (key) => {
    if (sounds[key]) {
      sounds[key].play((success) => {
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

// Hook to use sound context
export const useSound = () => useContext(SoundContext);
