import confetti from 'canvas-confetti';
import { soundEngine } from '../utils/audio';

export const triggerPetalCelebration = () => {
  soundEngine.playSparkle();

  const colors = [
    '#fbcfe8', // soft blush pink
    '#f472b6', // rose pink
    '#e9d5ff', // warm lavender
    '#c084fc', // orchid lavender
    '#bbf7d0', // sage green
    '#86efac', // fresh sage
    '#fde047', // gold foil
    '#fbbf24', // deep gold
    '#ffffff', // pearl white
  ];

  // Center upward blossom burst
  confetti({
    particleCount: 50,
    spread: 75,
    origin: { y: 0.7, x: 0.5 },
    colors,
    ticks: 240,
    gravity: 0.65,
    scalar: 1.25,
    drift: 0.1,
    shapes: ['circle', 'square'],
  });

  // Left wing petal spray
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 60,
      spread: 60,
      origin: { x: 0.1, y: 0.6 },
      colors,
      ticks: 220,
      gravity: 0.55,
      scalar: 1.1,
      drift: 0.2,
    });
  }, 180);

  // Right wing petal spray
  setTimeout(() => {
    confetti({
      particleCount: 40,
      angle: 120,
      spread: 60,
      origin: { x: 0.9, y: 0.6 },
      colors,
      ticks: 220,
      gravity: 0.55,
      scalar: 1.1,
      drift: -0.2,
    });
  }, 360);
};
