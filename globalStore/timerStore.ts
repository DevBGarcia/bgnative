// useStore.js
import create from 'zustand';
import { devtools } from 'zustand/middleware'


// Define a type for the state
type State = {
  counter: number;
  increment: () => void;
  decrement: () => void;
};

export const useTimerStore = create<State>()(
  devtools(set => ({
    counter: 0,
    increment: () => set(state => ({ counter: state.counter + 1 })),
    decrement: () => set(state => ({ counter: state.counter - 1 })),
  }), {name: 'TimerStore'})
);

