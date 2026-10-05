import React, { useEffect, useState, useRef, useCallback } from 'react';
import { soundEngine } from '../utils/audio';

export interface ButterflyInstance {
  id: string;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  vx: number;
  vy: number;
  swayFreq: number;
  swayAmp: number;
  swayPhase: number;
  scale: number;
  rotation: number;
  flapSpeed: string;
  palette: ButterflyPalette;
  createdAt: number;
  duration: number; // in milliseconds
  sparkles: { x: number; y: number; alpha: number; size: number; id: number }[];
}

export interface ButterflyPalette {
  name: string;
  wingGradientStart: string;
  wingGradientEnd: string;
  veinColor: string;
  edgeGlow: string;
  bodyColor: string;
  sparkleColor: string;
}

const PALETTES: ButterflyPalette[] = [
  {
    name: 'Blush Rose Gold',
    wingGradientStart: '#fbcfe8',
    wingGradientEnd: '#f43f5e',
    veinColor: '#fbbf24',
    edgeGlow: 'rgba(244, 63, 94, 0.4)',
    bodyColor: '#881337',
    sparkleColor: '#fde047',
  },
  {
    name: 'Warm Lavender Orchid',
    wingGradientStart: '#ede9fe',
    wingGradientEnd: '#9333ea',
    veinColor: '#fef08a',
    edgeGlow: 'rgba(147, 51, 234, 0.35)',
    bodyColor: '#581c87',
    sparkleColor: '#e9d5ff',
  },
  {
    name: 'Sage Emerald Nymph',
    wingGradientStart: '#d1fae5',
    wingGradientEnd: '#059669',
    veinColor: '#fef08a',
    edgeGlow: 'rgba(16, 185, 129, 0.35)',
    bodyColor: '#064e3b',
    sparkleColor: '#a7f3d0',
  },
  {
    name: 'Golden Sunlit Foil',
    wingGradientStart: '#fef9c3',
    wingGradientEnd: '#d97706',
    veinColor: '#ffffff',
    edgeGlow: 'rgba(245, 158, 11, 0.4)',
    bodyColor: '#78350f',
    sparkleColor: '#fef08a',
  },
  {
    name: 'Mother of Pearl',
    wingGradientStart: '#ffffff',
    wingGradientEnd: '#c4b5fd',
    veinColor: '#fb7185',
    edgeGlow: 'rgba(255, 255, 255, 0.6)',
    bodyColor: '#475569',
    sparkleColor: '#ffffff',
  },
];

// Custom Event Name for programmatic triggers
export const BUTTERFLY_TRIGGER_EVENT = 'spawn-butterflies';

export const triggerButterflies = (x: number, y: number, count: number = 6) => {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(
      new CustomEvent(BUTTERFLY_TRIGGER_EVENT, {
        detail: { x, y, count },
      })
    );
  }
};

export const ButterflyEffect: React.FC = () => {
  const [butterflies, setButterflies] = useState<ButterflyInstance[]>([]);
  const nextSparkleId = useRef(0);

  const spawnAt = useCallback((x: number, y: number, count: number = 5) => {
    soundEngine.playFlutterChime();

    const now = performance.now();
    const newButterflies: ButterflyInstance[] = [];

    for (let i = 0; i < count; i++) {
      // Radiate outward and primarily upwards
      const angle = -Math.PI / 2 + (Math.random() - 0.5) * 1.5; // Upward cone (-135 deg to -45 deg)
      const speed = Math.random() * 2.8 + 2.2;
      const vx = Math.cos(angle) * speed + (Math.random() - 0.5) * 1.2;
      const vy = Math.sin(angle) * speed - 1.2; // Extra upward buoyancy

      const palette = PALETTES[Math.floor(Math.random() * PALETTES.length)];
      const flapTime = (0.11 + Math.random() * 0.06).toFixed(3) + 's';

      newButterflies.push({
        id: `bf_${now}_${Math.random()}_${i}`,
        startX: x,
        startY: y,
        currentX: x + (Math.random() - 0.5) * 15,
        currentY: y + (Math.random() - 0.5) * 15,
        vx,
        vy,
        swayFreq: Math.random() * 0.008 + 0.005,
        swayAmp: Math.random() * 1.8 + 1.2,
        swayPhase: Math.random() * Math.PI * 2,
        scale: Math.random() * 0.35 + 0.75, // 0.75 to 1.1
        rotation: (vx * 8) - 10,
        flapSpeed: flapTime,
        palette,
        createdAt: now,
        duration: Math.random() * 1200 + 2600, // 2.6s - 3.8s
        sparkles: [],
      });
    }

    setButterflies((prev) => [...prev.slice(-35), ...newButterflies]);
  }, []);

  // Global Click Listener for Buttons
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement | null;
      if (!target) return;

      // Check if clicked element is a button, inside a button, or interactive card element
      const interactiveEl = target.closest('button, a, [role="button"], input[type="button"]');
      if (interactiveEl) {
        let posX = e.clientX;
        let posY = e.clientY;

        // Fallback to center of interactive element on mobile taps if coordinates are missing
        if ((posX === 0 && posY === 0) || !posX || !posY) {
          const rect = interactiveEl.getBoundingClientRect();
          posX = rect.left + rect.width / 2;
          posY = rect.top + rect.height / 2;
        }

        const count = Math.floor(Math.random() * 3) + 5; // 5-7 butterflies
        spawnAt(posX, posY, count);
      }
    };

    const handleCustomTrigger = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number; count?: number }>;
      if (customEvent.detail) {
        spawnAt(
          customEvent.detail.x,
          customEvent.detail.y,
          customEvent.detail.count || 6
        );
      }
    };

    window.addEventListener('click', handleClick, { passive: true });
    window.addEventListener(BUTTERFLY_TRIGGER_EVENT, handleCustomTrigger);

    return () => {
      window.removeEventListener('click', handleClick);
      window.removeEventListener(BUTTERFLY_TRIGGER_EVENT, handleCustomTrigger);
    };
  }, [spawnAt]);

  // Animation Loop updating positions, flutter physics, and sparkle trails
  useEffect(() => {
    if (butterflies.length === 0) return;

    let frameId: number;

    const updatePhysics = () => {
      const now = performance.now();

      setButterflies((prev) => {
        const next: ButterflyInstance[] = [];

        for (const bf of prev) {
          const age = now - bf.createdAt;
          if (age > bf.duration) {
            continue; // End of lifespan
          }

          // Progress 0 to 1
          const progress = age / bf.duration;

          // Upward drift and soft wind sway
          const sway = Math.sin(now * bf.swayFreq + bf.swayPhase) * bf.swayAmp;
          const currentX = bf.currentX + bf.vx + sway;
          const currentY = bf.currentY + bf.vy;

          // Slow down horizontal velocity gently, keep gentle upward drift
          const vx = bf.vx * 0.985;
          const vy = Math.max(-3.5, bf.vy * 0.98 - 0.035);

          // Update rotation to track flight angle with fluttering tilt
          const targetRotation = (vx * 12) + (sway * 8);

          // Update sparkle trail
          const sparkles = bf.sparkles
            .map((sp) => ({ ...sp, alpha: sp.alpha - 0.035, size: sp.size * 0.95 }))
            .filter((sp) => sp.alpha > 0);

          // Periodically emit stardust
          if (Math.random() < 0.35 && progress < 0.85) {
            sparkles.push({
              x: currentX + (Math.random() - 0.5) * 8,
              y: currentY + (Math.random() - 0.5) * 8,
              alpha: 0.85,
              size: Math.random() * 3 + 2,
              id: nextSparkleId.current++,
            });
          }

          next.push({
            ...bf,
            currentX,
            currentY,
            vx,
            vy,
            rotation: targetRotation,
            sparkles,
          });
        }

        return next;
      });

      frameId = requestAnimationFrame(updatePhysics);
    };

    frameId = requestAnimationFrame(updatePhysics);
    return () => cancelAnimationFrame(frameId);
  }, [butterflies.length]);

  if (butterflies.length === 0) return null;

  return (
    <div
      className="fixed inset-0 pointer-events-none z-50 overflow-hidden"
      aria-hidden="true"
    >
      {butterflies.map((bf) => {
        const age = performance.now() - bf.createdAt;
        const progress = Math.min(1, Math.max(0, age / bf.duration));
        // Fade in quickly, then gently fade out towards end of life
        const opacity =
          progress < 0.1
            ? progress / 0.1
            : progress > 0.75
            ? (1 - progress) / 0.25
            : 1;

        return (
          <React.Fragment key={bf.id}>
            {/* Sparkle Trail Behind Butterfly */}
            {bf.sparkles.map((sp) => (
              <div
                key={sp.id}
                className="absolute rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2 shadow-xs"
                style={{
                  left: `${sp.x}px`,
                  top: `${sp.y}px`,
                  width: `${sp.size}px`,
                  height: `${sp.size}px`,
                  backgroundColor: bf.palette.sparkleColor,
                  opacity: sp.alpha * opacity,
                  boxShadow: `0 0 8px ${bf.palette.edgeGlow}`,
                }}
              />
            ))}

            {/* 3D Butterfly Container */}
            <div
              className="absolute pointer-events-none transition-transform will-change-transform"
              style={{
                left: `${bf.currentX}px`,
                top: `${bf.currentY}px`,
                transform: `translate(-50%, -50%) scale(${bf.scale}) rotate(${bf.rotation}deg)`,
                opacity,
              }}
            >
              {/* 3D Perspective Stage for Realistic Wing Flap */}
              <div
                className="relative flex items-center justify-center w-12 h-10 preserve-3d"
                style={{
                  perspective: '450px',
                  // eslint-disable-next-line @typescript-eslint/no-explicit-any
                  ['--flap-speed' as any]: bf.flapSpeed,
                }}
              >
                {/* LEFT WING (Flaps in 3D around right origin) */}
                <div className="absolute right-1/2 top-0 w-6 h-10 butterfly-wing-left">
                  <svg
                    viewBox="0 0 40 60"
                    className="w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id={`grad_l_${bf.id}`} x1="100%" y1="50%" x2="0%" y2="50%">
                        <stop offset="0%" stopColor={bf.palette.wingGradientEnd} />
                        <stop offset="50%" stopColor={bf.palette.wingGradientStart} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>

                    {/* Forewing */}
                    <path
                      d="M 38 32 C 34 20, 24 4, 12 2 C 2 0, -2 12, 4 24 C 9 32, 22 36, 38 32 Z"
                      fill={`url(#grad_l_${bf.id})`}
                      stroke={bf.palette.veinColor}
                      strokeWidth="1"
                      strokeOpacity="0.75"
                    />

                    {/* Hindwing */}
                    <path
                      d="M 38 32 C 32 36, 18 42, 10 50 C 4 56, 12 60, 20 58 C 28 56, 35 48, 38 32 Z"
                      fill={`url(#grad_l_${bf.id})`}
                      stroke={bf.palette.veinColor}
                      strokeWidth="1"
                      strokeOpacity="0.7"
                    />

                    {/* Delicate Veins Filigree */}
                    <path
                      d="M 36 30 Q 22 18 14 8 M 36 31 Q 20 25 8 20 M 36 34 Q 24 42 16 48"
                      stroke={bf.palette.veinColor}
                      strokeWidth="0.8"
                      strokeOpacity="0.65"
                    />

                    {/* Edge Pearlescent Gold Dots */}
                    <circle cx="8" cy="10" r="1.2" fill={bf.palette.veinColor} />
                    <circle cx="5" cy="20" r="1.2" fill={bf.palette.veinColor} />
                    <circle cx="12" cy="54" r="1" fill={bf.palette.veinColor} />
                  </svg>
                </div>

                {/* RIGHT WING (Flaps in 3D around left origin) */}
                <div className="absolute left-1/2 top-0 w-6 h-10 butterfly-wing-right">
                  <svg
                    viewBox="0 0 40 60"
                    className="w-full h-full drop-shadow-[0_2px_6px_rgba(0,0,0,0.12)]"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <defs>
                      <linearGradient id={`grad_r_${bf.id}`} x1="0%" y1="50%" x2="100%" y2="50%">
                        <stop offset="0%" stopColor={bf.palette.wingGradientEnd} />
                        <stop offset="50%" stopColor={bf.palette.wingGradientStart} />
                        <stop offset="100%" stopColor="#ffffff" stopOpacity="0.9" />
                      </linearGradient>
                    </defs>

                    {/* Forewing */}
                    <path
                      d="M 2 32 C 6 20, 16 4, 28 2 C 38 0, 42 12, 36 24 C 31 32, 18 36, 2 32 Z"
                      fill={`url(#grad_r_${bf.id})`}
                      stroke={bf.palette.veinColor}
                      strokeWidth="1"
                      strokeOpacity="0.75"
                    />

                    {/* Hindwing */}
                    <path
                      d="M 2 32 C 8 36, 22 42, 30 50 C 36 56, 28 60, 20 58 C 12 56, 5 48, 2 32 Z"
                      fill={`url(#grad_r_${bf.id})`}
                      stroke={bf.palette.veinColor}
                      strokeWidth="1"
                      strokeOpacity="0.7"
                    />

                    {/* Delicate Veins Filigree */}
                    <path
                      d="M 4 30 Q 18 18 26 8 M 4 31 Q 20 25 32 20 M 4 34 Q 16 42 24 48"
                      stroke={bf.palette.veinColor}
                      strokeWidth="0.8"
                      strokeOpacity="0.65"
                    />

                    {/* Edge Pearlescent Gold Dots */}
                    <circle cx="32" cy="10" r="1.2" fill={bf.palette.veinColor} />
                    <circle cx="35" cy="20" r="1.2" fill={bf.palette.veinColor} />
                    <circle cx="28" cy="54" r="1" fill={bf.palette.veinColor} />
                  </svg>
                </div>

                {/* Central Butterfly Body & Antennae */}
                <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
                  <div
                    className="w-[2.2px] h-6 rounded-full shadow-xs"
                    style={{ backgroundColor: bf.palette.bodyColor }}
                  />
                  {/* Delicate Curved Antennae */}
                  <div className="absolute top-[5px] flex items-center justify-center w-3 h-2 pointer-events-none">
                    <div
                      className="w-1.5 h-1.5 border-t border-l rounded-tl-full"
                      style={{ borderColor: bf.palette.bodyColor }}
                    />
                    <div
                      className="w-1.5 h-1.5 border-t border-r rounded-tr-full"
                      style={{ borderColor: bf.palette.bodyColor }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </React.Fragment>
        );
      })}
    </div>
  );
};
