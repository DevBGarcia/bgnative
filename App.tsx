import React from 'react';
import { RootNavigator } from './navigators/RootNavigator';
import { SoundProvider } from './context/SoundManager';

const App = () => {
  return (
    <SoundProvider>
      <RootNavigator />
    </SoundProvider>
  );
};

export default App;
