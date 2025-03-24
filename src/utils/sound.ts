// Sound utility functions
let sounds: Record<string, HTMLAudioElement> = {};

// Initialize sounds only on the client side
if (typeof window !== 'undefined') {
  sounds = {
    click: new Audio('/sounds/click.mp3'),
    success: new Audio('/sounds/success.mp3'),
    failure: new Audio('/sounds/failure.mp3'),
    background: new Audio('/sounds/background-music.mp3'),
    achievement: new Audio('/sounds/achievement.mp3'),
    gameStart: new Audio('/sounds/game-start.mp3'),
    gameEnd: new Audio('/sounds/game-end.mp3')
  };

  // Background music settings
  sounds.background.loop = true;
  sounds.background.volume = 0.3;

  // Sound effects volume
  Object.values(sounds).forEach(sound => {
    if (sound !== sounds.background) {
      sound.volume = 0.5;
    }
  });
}

export const playSound = (soundName: string) => {
  if (typeof window === 'undefined') return;
  
  const sound = sounds[soundName];
  if (sound) {
    sound.currentTime = 0;
    sound.play().catch(error => console.log('Sound play failed:', error));
  }
};

export const toggleBackgroundMusic = () => {
  if (typeof window === 'undefined') return;
  
  if (sounds.background.paused) {
    sounds.background.play();
  } else {
    sounds.background.pause();
  }
};

export const setVolume = (volume: number) => {
  if (typeof window === 'undefined') return;
  
  Object.values(sounds).forEach(sound => {
    sound.volume = volume;
  });
}; 