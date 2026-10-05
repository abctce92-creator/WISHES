import React, { useEffect, useState, useRef, useCallback } from 'react';
import { X, Sparkles, Heart, RotateCcw, Volume2 } from 'lucide-react';
import { sampleTextPoints, Point2D } from '../utils/textPoints';
import { soundEngine } from '../utils/audio';
import { triggerPetalCelebration } from './PetalShower';

interface FormationButterfly {
  id: number;
  startX: number;
  startY: number;
  currentX: number;
  currentY: number;
  targetX: number;
  targetY: number;
  speed: number;
  swayFreq: number;
  swayAmp: number;
  swayPhase: number;
  scale: number;
  rotation: number;
  flapSpeed: string;
  palette: {
    start: string;
    end: string;
    veins: string;
    glow: string;
    body: string;
  };
}

const PALETTES = [
  {
    start: '#fbcfe8',
    end: '#f43f5e',
    veins: '#fbbf24',
    glow: 'rgba(244, 63, 94, 0.5)',
    body: '#881337',
  },
  {
    start: '#ede9fe',
    end: '#9333ea',
    veins: '#fef08a',
    glow: 'rgba(147, 51, 234, 0.45)',
    body: '#581c87',
  },
  {
    start: '#d1fae5',
    end: '#059669',
    veins: '#fef08a',
    glow: 'rgba(16, 185, 129, 0.45)',
    body: '#064e3b',
  },
  {
    start: '#fef9c3',
    end: '#d97706',
    veins: '#ffffff',
    glow: 'rgba(245, 158, 11, 0.5)',
    body: '#78350f',
  },
  {
    start: '#ffffff',
    end: '#c4b5fd',
    veins: '#fb7185',
    glow: 'rgba(255, 255, 255, 0.6)',
    body: '#475569',
  },
];

interface ButterflyNameFormationProps {
  isOpen: boolean;
  onClose: () => void;
  defaultText?: string;
}

export const ButterflyNameFormation: React.FC<ButterflyNameFormationProps> = ({
  isOpen,
  onClose,
  defaultText = 'REVATHI',
}) => {
  const [activeWord, setActiveWord] = useState(defaultText);
  const [stage, setStage] = useState<'converging' | 'formed' | 'dispersing'>('converging');
  const [butterflies, setButterflies] = useState<FormationButterfly[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Initialize or re-form the butterflies whenever modal opens or word changes
  const initializeFormation = useCallback((wordToForm: string) => {
    soundEngine.playFlutterChime();
    setStage('converging');

    const width = window.innerWidth;
    const height = window.innerHeight;
    const isMobile = width < 640;

    // Pick target points for the word
    const pointCount = isMobile ? (wordToForm.length > 7 ? 65 : 75) : 100;
    const rawPoints = sampleTextPoints(wordToForm, width, height, pointCount);

    if (rawPoints.length === 0) return;

    // Center offset to position the formed word nicely in vertical screen center
    const canvasH = Math.min(400, Math.floor(height * 0.45));
    const verticalOffset = height * 0.38 - canvasH / 2;

    const newButterflies: FormationButterfly[] = rawPoints.map((pt, idx) => {
      // Spawn from perimeter or center burst
      const spawnFromCenter = Math.random() < 0.4;
      let startX: number;
      let startY: number;

      if (spawnFromCenter) {
        startX = width / 2 + (Math.random() - 0.5) * 120;
        startY = height / 2 + (Math.random() - 0.5) * 120;
      } else {
        // Spawn from random screen edges
        const edge = Math.floor(Math.random() * 4);
        if (edge === 0) {
          startX = Math.random() * width;
          startY = -40;
        } else if (edge === 1) {
          startX = width + 40;
          startY = Math.random() * height;
        } else if (edge === 2) {
          startX = Math.random() * width;
          startY = height + 40;
        } else {
          startX = -40;
          startY = Math.random() * height;
        }
      }

      const palette = PALETTES[idx % PALETTES.length];
      const targetX = pt.x;
      const targetY = pt.y + verticalOffset;

      return {
        id: idx,
        startX,
        startY,
        currentX: startX,
        currentY: startY,
        targetX,
        targetY,
        speed: Math.random() * 0.04 + 0.055,
        swayFreq: Math.random() * 0.006 + 0.004,
        swayAmp: Math.random() * 2 + 1,
        swayPhase: Math.random() * Math.PI * 2,
        scale: (isMobile ? 0.65 : 0.85) + Math.random() * 0.2,
        rotation: (Math.random() - 0.5) * 30,
        flapSpeed: (0.11 + Math.random() * 0.05).toFixed(3) + 's',
        palette,
      };
    });

    setButterflies(newButterflies);

    // After 2.2 seconds, declare fully formed
    window.setTimeout(() => {
      setStage('formed');
      soundEngine.playSparkle();
    }, 2200);
  }, []);

  useEffect(() => {
    if (isOpen) {
      initializeFormation(activeWord);
    }
  }, [isOpen, activeWord, initializeFormation]);

  // Physics animation loop for smooth convergence and organic hovering
  useEffect(() => {
    if (!isOpen || butterflies.length === 0) return;

    let frameId: number;

    const animate = () => {
      const now = performance.now();

      setButterflies((prev) =>
        prev.map((bf) => {
          if (stage === 'dispersing') {
            // Fly upwards and away into sky
            const vy = -4 - Math.random() * 2;
            const vx = (Math.random() - 0.5) * 6;
            return {
              ...bf,
              currentX: bf.currentX + vx,
              currentY: bf.currentY + vy,
              rotation: bf.rotation + vx * 2,
            };
          }

          // Convergence physics (smooth spring damping)
          const dx = bf.targetX - bf.currentX;
          const dy = bf.targetY - bf.currentY;
          const dist = Math.sqrt(dx * dx + dy * dy);

          // Gentle hover vibration when in place
          const sway = Math.sin(now * bf.swayFreq + bf.swayPhase) * bf.swayAmp;
          const swayY = Math.cos(now * bf.swayFreq + bf.swayPhase) * (bf.swayAmp * 0.8);

          if (dist < 3) {
            return {
              ...bf,
              currentX: bf.targetX + sway,
              currentY: bf.targetY + swayY,
              rotation: sway * 4,
            };
          }

          const currentX = bf.currentX + dx * bf.speed + sway * 0.3;
          const currentY = bf.currentY + dy * bf.speed + swayY * 0.3;
          const targetRotation = Math.atan2(dy, dx) * (180 / Math.PI) - 90;

          return {
            ...bf,
            currentX,
            currentY,
            rotation: targetRotation * 0.15 + sway * 3,
          };
        })
      );

      frameId = requestAnimationFrame(animate);
    };

    frameId = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frameId);
  }, [isOpen, stage, butterflies.length]);

  const handleDisperse = () => {
    setStage('dispersing');
    soundEngine.playFlutterChime();
    triggerPetalCelebration();
    setTimeout(() => {
      onClose();
    }, 1200);
  };

  const handleReplay = (newWord?: string) => {
    const word = newWord || activeWord;
    if (newWord) setActiveWord(newWord);
    initializeFormation(word);
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 z-50 flex flex-col items-center justify-between p-4 bg-slate-950/65 backdrop-blur-xl animate-fadeIn select-none overflow-hidden"
    >
      {/* Ambient Starlight & Gradient Glow in Background */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] rounded-full bg-gradient-to-r from-pink-400/20 via-purple-400/25 to-emerald-400/20 blur-[90px] animate-pulse-glow" />
      </div>

      {/* Top Header Bar */}
      <div className="relative z-20 w-full max-w-4xl flex items-center justify-between pt-2 px-2">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-ping" />
          <span className="text-xs sm:text-sm font-sans-clean font-semibold tracking-[0.2em] uppercase text-white/90 drop-shadow-sm">
            Butterfly Constellation
          </span>
        </div>

        {/* Word Switcher & Close Button */}
        <div className="flex items-center gap-2">
          <div className="inline-flex rounded-full bg-white/10 p-1 backdrop-blur-md border border-white/20">
            <button
              type="button"
              onClick={() => handleReplay('REVATHI')}
              className={`px-3 py-1 rounded-full text-xs font-sans-clean font-medium transition-colors ${
                activeWord === 'REVATHI'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              REVATHI
            </button>
            <button
              type="button"
              onClick={() => handleReplay('AMMA REVATHI')}
              className={`px-3 py-1 rounded-full text-xs font-sans-clean font-medium transition-colors ${
                activeWord === 'AMMA REVATHI'
                  ? 'bg-white text-slate-900 shadow-sm'
                  : 'text-white/70 hover:text-white'
              }`}
            >
              AMMA REVATHI
            </button>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white/80 hover:text-white border border-white/20 transition-colors"
            aria-label="Close constellation"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Center Stage: The Butterflies forming Mom's name */}
      <div className="relative w-full h-full pointer-events-none">
        {butterflies.map((bf) => (
          <div
            key={bf.id}
            className="absolute pointer-events-none transition-transform will-change-transform"
            style={{
              left: `${bf.currentX}px`,
              top: `${bf.currentY}px`,
              transform: `translate(-50%, -50%) scale(${bf.scale}) rotate(${bf.rotation}deg)`,
              filter: `drop-shadow(0 0 6px ${bf.palette.glow})`,
            }}
          >
            {/* 3D Perspective Stage for Butterfly Wing Flap */}
            <div
              className="relative flex items-center justify-center w-10 h-8 preserve-3d"
              style={{
                perspective: '450px',
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                ['--flap-speed' as any]: bf.flapSpeed,
              }}
            >
              {/* Left Wing */}
              <div className="absolute right-1/2 top-0 w-5 h-8 butterfly-wing-left">
                <svg viewBox="0 0 40 60" className="w-full h-full" fill="none">
                  <defs>
                    <linearGradient id={`form_l_${bf.id}`} x1="100%" y1="50%" x2="0%" y2="50%">
                      <stop offset="0%" stopColor={bf.palette.end} />
                      <stop offset="60%" stopColor={bf.palette.start} />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 38 32 C 34 20, 24 4, 12 2 C 2 0, -2 12, 4 24 C 9 32, 22 36, 38 32 Z"
                    fill={`url(#form_l_${bf.id})`}
                    stroke={bf.palette.veins}
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 38 32 C 32 36, 18 42, 10 50 C 4 56, 12 60, 20 58 C 28 56, 35 48, 38 32 Z"
                    fill={`url(#form_l_${bf.id})`}
                    stroke={bf.palette.veins}
                    strokeWidth="1.2"
                  />
                </svg>
              </div>

              {/* Right Wing */}
              <div className="absolute left-1/2 top-0 w-5 h-8 butterfly-wing-right">
                <svg viewBox="0 0 40 60" className="w-full h-full" fill="none">
                  <defs>
                    <linearGradient id={`form_r_${bf.id}`} x1="0%" y1="50%" x2="100%" y2="50%">
                      <stop offset="0%" stopColor={bf.palette.end} />
                      <stop offset="60%" stopColor={bf.palette.start} />
                      <stop offset="100%" stopColor="#ffffff" />
                    </linearGradient>
                  </defs>
                  <path
                    d="M 2 32 C 6 20, 16 4, 28 2 C 38 0, 42 12, 36 24 C 31 32, 18 36, 2 32 Z"
                    fill={`url(#form_r_${bf.id})`}
                    stroke={bf.palette.veins}
                    strokeWidth="1.2"
                  />
                  <path
                    d="M 2 32 C 8 36, 22 42, 30 50 C 36 56, 28 60, 20 58 C 12 56, 5 48, 2 32 Z"
                    fill={`url(#form_r_${bf.id})`}
                    stroke={bf.palette.veins}
                    strokeWidth="1.2"
                  />
                </svg>
              </div>

              {/* Body */}
              <div
                className="w-1.5 h-6 rounded-full z-10"
                style={{ backgroundColor: bf.palette.body }}
              />
            </div>
          </div>
        ))}
      </div>

      {/* Bottom Message & Controls Banner */}
      <div className="relative z-20 w-full max-w-xl text-center pb-4 px-2">
        <div className="p-4 sm:p-5 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 shadow-xl">
          <p className="font-script text-3xl sm:text-4xl text-amber-200 gold-subtle-text">
            Amma Revathi
          </p>
          <p className="text-xs sm:text-sm font-sans-clean text-white/90 mt-1 font-medium tracking-wide">
            Over a hundred butterflies hovering together to spell your name, Amma!
          </p>
          <p className="text-[11px] font-sans-clean text-amber-300/90 tracking-widest uppercase mt-0.5">
            With eternal love, Barath Kumar
          </p>

          <div className="mt-4 flex flex-wrap items-center justify-center gap-2.5">
            <button
              type="button"
              onClick={() => handleReplay()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-sans-clean font-medium bg-white/20 hover:bg-white/30 text-white border border-white/30 transition-all touch-manipulation active:scale-95"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Re-form Swarm</span>
            </button>

            <button
              type="button"
              onClick={handleDisperse}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-full text-xs font-sans-clean font-semibold text-slate-900 bg-gradient-to-r from-amber-300 via-rose-200 to-emerald-200 hover:from-amber-400 hover:to-rose-300 shadow-md transition-all touch-manipulation active:scale-95"
            >
              <Sparkles className="w-4 h-4 text-slate-900" />
              <span>Scatter & Celebrate</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
