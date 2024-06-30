// useStore.js
import create from 'zustand';
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
  selectedTimer: Timer | null,
  timerList: Timer[],
  setSelectedTimer: (timer: Timer) => void,
  addTimer: (timer: Timer) => void,
  deleteTimer: (timer: Timer) => void,
};

export const useTimerStore = create<State>()(
  devtools(set => ({
    selectedTimer: null,
    timerList: [],
    setSelectedTimer: (timer: Timer) => set({ selectedTimer: timer }),
    addTimer: (timer: Timer) => set(state => ({ timerList: [...state.timerList, timer] })),
    deleteTimer: (timer: Timer) => set(state => ({ timerList: state.timerList.filter(t => t !== timer) })),
  }), {name: 'TimerStore'})
);

