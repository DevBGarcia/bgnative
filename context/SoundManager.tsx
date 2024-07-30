import React, { createContext, useContext, useEffect, useState } from 'react';
import Sound from 'react-native-sound';
import { SoundKey, SOUND_KEYS } from './SoundKeys';
import { AudioManager } from 'react-native-audio-toolkit'; // Import AudioManager from react-native-audio-toolkit

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
        } else {
          acc[key].setVolume(1.0); // Set volume to maximum (1.0)
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

  const playSound = (key: SoundKey) => {
    if (sounds[key]) {
      // Request audio focus
      AudioManager.requestAudioFocus(
        (focusChange) => {
          if (focusChange === AudioManager.AUDIOFOCUS_GAIN) {
            // Gained audio focus
            sounds[key].setVolume(1.0); // Ensure volume is set before playing
            sounds[key].play((success) => {
              if (!success) {
                console.log('Playback failed due to audio decoding errors');
              }
            });
          } else if (focusChange === AudioManager.AUDIOFOCUS_LOSS) {
            // Lost audio focus
            sounds[key].stop();
          }
        },
        AudioManager.STREAM_MUSIC,
        AudioManager.AUDIOFOCUS_GAIN_TRANSIENT
      );
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
