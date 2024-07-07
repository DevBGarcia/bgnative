import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Timer = {
  intervalTime: number,
  intervalCount: number,
  restTime: number,
  warmupTime: number,
  timerTitle: string,
}

export const DEFAULT_TIMER_PARAMS: Timer = {
  intervalTime: 5,
  intervalCount: 2,
  restTime: 3,
  warmupTime: 2,
  timerTitle: 'Default Timer',
};

// Define a type for the state
type State = {
  selectedTimer: Timer,
  setSelectedTimer: (timer: Timer) => void,
};

export const useTimerStore = create<State>()(
  devtools(set => ({
    selectedTimer: DEFAULT_TIMER_PARAMS,
    setSelectedTimer: (timer: Timer) => set({ selectedTimer: timer }),
  }), {name: 'TimerStore'})
);