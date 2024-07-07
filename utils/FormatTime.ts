export const formatTime = (seconds: number) => {
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    const formatNumber = (num: number) => String(num).padStart(2, '0');

    return `${formatNumber(minutes)}:${formatNumber(remainingSeconds)}`;
  };
