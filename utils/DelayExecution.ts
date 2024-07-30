import BackgroundTimer from 'react-native-background-timer';

/**
 * Delays the execution of a callback function by a specified number of seconds.
 * @param callback The callback function to be executed after the delay.
 * @param delayInSeconds The delay in seconds before the callback is executed.
 */
export const delayExecution = (callback: () => void, delayInSeconds: number): void => {
  // Convert seconds to milliseconds
  const delayInMilliseconds = delayInSeconds * 1000;

  // Use BackgroundTimer to execute the callback after the specified delay
  BackgroundTimer.setTimeout(callback, delayInMilliseconds);
};
