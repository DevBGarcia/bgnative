import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export type Timer = {
  intervalTime: number;
  intervalCount: number;
  restTime: number;
  warmupTime: number;
  timerName: string;
};

export const DEFAULT_TIMER_PARAMS: Timer = {
  intervalTime: 10,
  intervalCount: 3,
  restTime: 10,
  warmupTime: 10,
  timerName: 'Default Timer',
};

// Define a type for the state
type State = {
  selectedTimer: Timer;
  isTimerUpdateLoading: boolean;
  setSelectedTimer: (timer: Timer) => void;
  setIsTimerUpdateLoading: (isLoading: boolean) => void;
  triggerResetTimerFlag: () => void;
  resetTimerFlag: boolean;
};

export const useTimerStore = create<State>()(
  persist(
    (set) => ({
      resetTimerFlag: false,
      selectedTimer: DEFAULT_TIMER_PARAMS,
      setSelectedTimer: (timer: Timer) => set({ selectedTimer: timer }),
      isTimerUpdateLoading: false,
      setIsTimerUpdateLoading: (isLoading: boolean) => set({ isTimerUpdateLoading: isLoading }),
      triggerResetTimerFlag: () => set((state) => ({ resetTimerFlag: !state.resetTimerFlag })),
    }),
    {
      name: 'timer-store', // storage name
    }
  )
);
