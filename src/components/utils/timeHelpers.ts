export const calculateElapsedTimeInSeconds = (
  lastUpdateTime: number
): number => {
  return Math.floor((Date.now() - lastUpdateTime) / 1000);
};

export const updateFeedAndTimer = (
  initialFeed: number,
  initialTimer: number,
  elapsedSeconds: number,
  maxFeed: number,
  maxTimer: number
): { updatedFeed: number; updatedTimer: number } => {
  let updatedFeed = initialFeed;
  let updatedTimer = initialTimer - elapsedSeconds;

  while (updatedTimer <= 0) {
    if (updatedFeed < maxFeed) {
      updatedFeed += 1;
      updatedTimer += maxTimer;
    } else {
      updatedTimer = 0;
      break;
    }
  }

  return { updatedFeed, updatedTimer: Math.max(0, updatedTimer) };
};

export const decrementTimer = (
  prevTimer: number,
  maxFeed: number,
  feed: number,
  maxTimer: number
): number => {
  if (feed < maxFeed) {
    if (prevTimer <= 0) {
      return maxTimer;
    } else {
      return Math.max(0, prevTimer - 1);
    }
  }
  return prevTimer;
};
