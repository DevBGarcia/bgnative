import React, { createContext, useContext, useEffect, useState } from 'react';
import Sound from 'react-native-sound';

// Define the shape of the context data for better TypeScript support
interface SoundContextType {
  playSound: (soundName: string) => void;
}

// Provide a default value that matches the shape of SoundContextType
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

  useEffect(() => {
    // Initialize sounds
    const initializedSounds = {
      //I use this sound for pausing
      stopped: new Sound('stopped.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
        }
      }),
      //I use this sound for resuming
      returned: new Sound('returned.mp3', Sound.MAIN_BUNDLE, (error) => {
        if (error) {
          console.log('Failed to load the sound', error);
        }
      }),
      // Add more sounds here
    };

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
