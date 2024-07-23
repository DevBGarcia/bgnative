import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Timer = {
  intervalTime: number;
  intervalCount: number;
  restTime: number;
  warmupTime: number;
  timerName: string;
};

export const DEFAULT_TIMER_PARAMS: Timer = {
  intervalTime: 60,
  intervalCount: 2,
  restTime: 30,
  warmupTime: 15,
  timerName: 'Default Timer',
};

// Define a type for the state
type State = {
  selectedTimer: Timer;
  isTimerUpdateLoading: boolean;
  setSelectedTimer: (timer: Timer) => void;
  setIsTimerUpdateLoading: (isLoading: boolean) => void;
};

export const useTimerStore = create<State>()(
  devtools(
    (set) => ({
      selectedTimer: DEFAULT_TIMER_PARAMS,
      setSelectedTimer: (timer: Timer) => set({ selectedTimer: timer }),
      isTimerUpdateLoading: false,
      setIsTimerUpdateLoading: (isLoading: boolean) => set({ isTimerUpdateLoading: isLoading }),
    }),
    { name: 'TimerStore' }
  )
);
