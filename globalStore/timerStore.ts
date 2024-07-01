import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export type Timer = {
  intervalTime: number,
  intervalCount: number,
  restTime: number,
}

export const DEFAULT_TIMER_PARAMS: Timer = {
  intervalTime: 180,
  intervalCount: 5,
  restTime: 60,
}

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