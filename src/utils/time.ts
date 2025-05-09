export const formatTime = (seconds: number) => {
  const minutes = Math.floor(seconds / 60);

  const formattedSeconds = String(seconds % 60).padStart(2, '0');
  const formattedMinutes = String(minutes).padStart(2, '0');
  return `${formattedMinutes}:${formattedSeconds}`;
}
