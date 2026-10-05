import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Sparkles, Heart, Flame, RotateCcw, Share2, Volume2, VolumeX, Eye } from 'lucide-react';
import { soundEngine } from '../utils/audio';
import { triggerPetalCelebration } from './PetalShower';
import { triggerButterflies } from './ButterflyEffect';

interface Card3DProps {
  onOpenPersonalize?: () => void;
  onOpenNameFormation?: () => void;
  customMessage?: string;
  lightingMode?: 'blush' | 'golden' | 'twilight';
  cardRef?: React.RefObject<HTMLDivElement | null>;
}

export const Card3D: React.FC<Card3DProps> = ({
  onOpenPersonalize,
  onOpenNameFormation,
  customMessage,
  lightingMode = 'blush',
  cardRef,
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  const [isCandleLit, setIsCandleLit] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovering, setIsHovering] = useState(false);

  const localContainerRef = useRef<HTMLDivElement | null>(null);

  // Smooth tilt handling
  const handlePointerMove = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      const rect = e.currentTarget.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      // Calculate tilt angles (degrees)
      const rotateY = ((x - centerX) / centerX) * 12;
      const rotateX = -((y - centerY) / centerY) * 12;

      // Glare position in percentage
      const glareX = (x / rect.width) * 100;
      const glareY = (y / rect.height) * 100;

      setTilt({ x: rotateX, y: rotateY });
      setGlare({ x: glareX, y: glareY, opacity: 0.35 });
    },
    []
  );

  const handlePointerEnter = () => {
    setIsHovering(true);
    soundEngine.playSparkle();
  };

  const handlePointerLeave = () => {
    setIsHovering(false);
    setTilt({ x: 0, y: 0 });
    setGlare((prev) => ({ ...prev, opacity: 0 }));
  };

  // Flip card handler
  const handleFlipCard = (e?: React.MouseEvent | React.TouchEvent) => {
    if (e) e.stopPropagation();
    soundEngine.playSparkle();

    // Trigger fluttering butterflies from click/tap location
    if (e && 'currentTarget' in e && e.currentTarget) {
      const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
      triggerButterflies(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
    } else if (localContainerRef.current) {
      const rect = localContainerRef.current.getBoundingClientRect();
      triggerButterflies(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
    }

    setIsFlipped((prev) => !prev);
  };

  // Light candle handler
  const handleLightCandle = (e: React.MouseEvent) => {
    e.stopPropagation();
    soundEngine.playSparkle();
    const rect = e.currentTarget.getBoundingClientRect();
    triggerButterflies(rect.left + rect.width / 2, rect.top + rect.height / 2, 6);
    setIsCandleLit((prev) => {
      if (!prev) triggerPetalCelebration();
      return !prev;
    });
  };

  // Music toggle handler
  const handleToggleMusic = () => {
    if (isPlayingMusic) {
      soundEngine.stopMelody();
      setIsPlayingMusic(false);
    } else {
      setIsPlayingMusic(true);
      soundEngine.playBirthdayMelody(() => {
        setIsPlayingMusic(false);
      });
    }
  };

  // Sound mute toggle
  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (nextMuted && isPlayingMusic) {
      setIsPlayingMusic(false);
    }
  };

  // Ambient lighting scheme styles
  const lightingStyles = {
    blush: {
      ambientGlow:
        'from-pink-300/40 via-purple-300/35 to-emerald-200/35',
      cardAura: 'rgba(244, 180, 205, 0.45)',
      haloGradient: 'radial-gradient(circle at 50% 50%, rgba(254, 215, 226, 0.6) 0%, rgba(233, 213, 255, 0.4) 45%, rgba(209, 250, 229, 0.35) 75%, transparent 100%)',
    },
    golden: {
      ambientGlow:
        'from-amber-200/45 via-rose-200/40 to-emerald-200/30',
      cardAura: 'rgba(251, 191, 36, 0.4)',
      haloGradient: 'radial-gradient(circle at 50% 50%, rgba(254, 240, 138, 0.6) 0%, rgba(253, 230, 138, 0.4) 50%, rgba(209, 250, 229, 0.3) 80%, transparent 100%)',
    },
    twilight: {
      ambientGlow:
        'from-purple-300/45 via-rose-300/40 to-teal-200/35',
      cardAura: 'rgba(192, 132, 252, 0.45)',
      haloGradient: 'radial-gradient(circle at 50% 50%, rgba(233, 213, 255, 0.6) 0%, rgba(244, 180, 205, 0.45) 50%, rgba(187, 247, 208, 0.3) 80%, transparent 100%)',
    },
  }[lightingMode];

  return (
    <div className="relative flex flex-col items-center justify-center w-full max-w-xl mx-auto px-2 sm:px-4 py-2 sm:py-6 perspective-1200">
      {/* Dynamic Ambient Studio Lighting Aura Behind Card */}
      <div
        className={`absolute -inset-4 sm:-inset-8 rounded-full blur-2xl sm:blur-3xl opacity-75 pointer-events-none transition-all duration-1000 animate-pulse-glow ${lightingStyles.ambientGlow}`}
        style={{
          background: lightingStyles.haloGradient,
          transform: `scale(${isHovering ? 1.08 : 1}) translate(${tilt.y * 1.5}px, ${-tilt.x * 1.5}px)`,
        }}
        aria-hidden="true"
      />

      {/* Floating 3D Botanical Decorative Petals around Card */}
      <div
        className="hidden sm:block absolute -top-6 -left-6 w-20 h-20 pointer-events-none transition-transform duration-700 ease-out z-20 animate-float-slow"
        style={{
          transform: `translate3d(${tilt.y * 2.2}px, ${-tilt.x * 2.2}px, 60px)`,
        }}
        aria-hidden="true"
      >
        <div className="w-12 h-12 rounded-full bg-gradient-to-tr from-pink-300/60 to-purple-200/50 blur-[2px] shadow-sm transform rotate-45 border border-white/60" />
      </div>

      <div
        className="hidden sm:block absolute -bottom-8 -right-4 w-24 h-24 pointer-events-none transition-transform duration-700 ease-out z-20 animate-float-reverse"
        style={{
          transform: `translate3d(${-tilt.y * 2}px, ${tilt.x * 2}px, 70px)`,
        }}
        aria-hidden="true"
      >
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-emerald-200/60 to-pink-200/50 blur-[2px] shadow-sm transform -rotate-12 border border-white/60" />
      </div>

      {/* 3D Tilt Card Container - Optimized for Mobile Touch & Proportions */}
      <div
        ref={localContainerRef}
        onPointerMove={handlePointerMove}
        onPointerEnter={handlePointerEnter}
        onPointerLeave={handlePointerLeave}
        className="relative w-full max-w-[390px] sm:max-w-[460px] aspect-[3/4.25] sm:aspect-[3/4] cursor-pointer preserve-3d transition-transform duration-300 ease-out select-none touch-manipulation"
        style={{
          transform: `rotateX(${tilt.x}deg) rotateY(${tilt.y + (isFlipped ? 180 : 0)}deg) translateZ(0px)`,
        }}
        onClick={handleFlipCard}
        title="Tap to open or flip card"
      >
        {/* Printable/Exportable Card Node (Attached via external ref if provided) */}
        <div
          ref={cardRef as React.LegacyRef<HTMLDivElement>}
          className="absolute inset-0 w-full h-full preserve-3d"
        >
          {/* ========================================================================= */}
          {/* FRONT FACE OF THE CARD                                                    */}
          {/* ========================================================================= */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[2.25rem] overflow-hidden glass-card-surface backface-hidden preserve-3d transition-shadow duration-500 ${
              isFlipped ? 'pointer-events-none' : ''
            }`}
            style={{
              boxShadow: `0 25px 60px -15px ${lightingStyles.cardAura}, 0 10px 25px -5px rgba(220, 245, 230, 0.4), inset 0 1px 3px rgba(255, 255, 255, 0.9)`,
            }}
          >
            {/* Background 3D Pastel Floral Artwork Image with Atmospheric Depth */}
            <div className="absolute inset-0 w-full h-full overflow-hidden">
              <img
                src="/src/assets/images/pastel_floral_art_1791202439602.jpg"
                alt="3D pastel floral digital artwork with blush pink, lavender, and sage green botanicals"
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover object-center scale-[1.03] opacity-85 transition-transform duration-700 ease-out"
                style={{
                  transform: `scale(1.05) translate(${tilt.y * 0.4}px, ${-tilt.x * 0.4}px)`,
                }}
              />
              {/* Soft Gradient Overlay for Studio Lighting, Soft Blush, Lavender, Sage Green */}
              <div className="absolute inset-0 bg-gradient-to-b from-white/45 via-pink-50/25 to-purple-50/45 mix-blend-soft-light" />
              <div className="absolute inset-0 bg-gradient-to-tr from-emerald-100/20 via-transparent to-pink-200/25 pointer-events-none" />
            </div>

            {/* Realistic Frosted Glassmorphism Layer with Soft Blur */}
            <div className="absolute inset-3 sm:inset-4 rounded-[1.75rem] border border-white/70 bg-white/35 backdrop-blur-[14px] shadow-[inset_0_0_24px_rgba(255,255,255,0.7)] pointer-events-none" />

            {/* Holographic Foil Dynamic Light Shimmer Overlay */}
            <div
              className="absolute inset-0 holographic-sheen opacity-60 transition-opacity duration-300 pointer-events-none"
              style={{
                backgroundPosition: `${glare.x}% ${glare.y}%`,
                opacity: isHovering ? 0.75 : 0.45,
              }}
            />

            {/* Specular Light Reflection Follower */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-200"
              style={{
                background: `radial-gradient(circle 350px at ${glare.x}% ${glare.y}%, rgba(255, 255, 255, 0.55) 0%, rgba(255, 245, 230, 0.15) 45%, transparent 70%)`,
                opacity: glare.opacity,
              }}
            />

            {/* Refined Gold Foil Border Accent Frame */}
            <div className="absolute inset-5 sm:inset-6 rounded-[1.5rem] border border-amber-300/40 pointer-events-none shadow-[inset_0_0_12px_rgba(251,191,36,0.1)]">
              {/* Corner Floral Filigrees */}
              <div className="absolute top-2 left-2 text-amber-500/60 font-serif text-xs">✦</div>
              <div className="absolute top-2 right-2 text-amber-500/60 font-serif text-xs">✦</div>
              <div className="absolute bottom-2 left-2 text-amber-500/60 font-serif text-xs">✦</div>
              <div className="absolute bottom-2 right-2 text-amber-500/60 font-serif text-xs">✦</div>
            </div>

            {/* 3D Floating Botanical Peony Accent (Deep Layer Parallax) */}
            <div
              className="absolute -bottom-4 -right-4 sm:-bottom-6 sm:-right-6 w-28 h-28 sm:w-44 sm:h-44 pointer-events-none transition-transform duration-500 ease-out z-20"
              style={{
                transform: `translate3d(${tilt.y * 1.6}px, ${-tilt.x * 1.6}px, 45px)`,
              }}
            >
              <img
                src="/src/assets/images/botanical_flower_accent_1791202460030.jpg"
                alt="3D delicate pastel peony flower with gold tipped edges"
                referrerPolicy="no-referrer"
                className="w-full h-full object-contain drop-shadow-[0_15px_25px_rgba(180,120,150,0.35)] rounded-full filter contrast-[1.04]"
              />
            </div>

            {/* Floating Delicate Golden Sparkle Embellishments in Front */}
            <div
              className="absolute top-6 right-6 sm:top-8 sm:right-8 pointer-events-none transition-transform duration-500 ease-out"
              style={{
                transform: `translate3d(${tilt.y * 1.2}px, ${-tilt.x * 1.2}px, 30px)`,
              }}
            >
              <div className="flex items-center gap-1 text-amber-400/80">
                <Sparkles className="w-4 h-4 sm:w-5 sm:h-5 animate-pulse text-amber-500" />
              </div>
            </div>

            {/* Central Content Area - Preserving 3D Height */}
            <div
              className="relative z-10 flex flex-col items-center justify-between h-full p-5 sm:p-8 md:p-10 text-center preserve-3d"
              style={{
                transform: 'translateZ(35px)',
              }}
            >
              {/* Card Header Top Note */}
              <div className="pt-1 sm:pt-2">
                <div className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1 rounded-full bg-white/60 backdrop-blur-md border border-amber-200/50 shadow-xs">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping" />
                  <span className="text-[10px] sm:text-[11px] font-sans-clean font-medium tracking-[0.2em] uppercase text-amber-800/80">
                    Celebration of Life & Joy
                  </span>
                </div>
              </div>

              {/* Central Primary Greeting Text: "Happy Birthday, Amma Revathi!" */}
              <div className="my-auto px-1 sm:px-2 max-w-md">
                <p className="text-xs sm:text-sm font-sans-clean tracking-[0.25em] sm:tracking-[0.3em] uppercase text-rose-800/70 font-medium mb-0.5 sm:mb-1 drop-shadow-xs">
                  Heartfelt Wishes
                </p>

                {/* THE GOLD METALLIC SCRIPT FONT HEADLINE */}
                <h1
                  className="font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.12] py-1.5 sm:py-2 gold-metallic-text tracking-wide select-none drop-shadow-md"
                  style={{
                    textShadow: '0 3px 18px rgba(212, 160, 40, 0.45)',
                  }}
                >
                  Happy Birthday,
                  <br />
                  <span className="font-pinyon sm:font-script text-4xl sm:text-5xl md:text-6xl lg:text-7xl block mt-0.5 sm:mt-1">
                    Amma Revathi!
                  </span>
                </h1>

                {/* Golden Floral Divider Line */}
                <div className="flex items-center justify-center gap-2 sm:gap-3 my-2.5 sm:my-4">
                  <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-r from-transparent via-amber-400 to-amber-200" />
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 rotate-45 border border-amber-400 bg-amber-100" />
                  <div className="h-[1px] w-8 sm:w-12 bg-gradient-to-l from-transparent via-amber-400 to-amber-200" />
                </div>

                {/* SUBTEXT: "With lots of love, Barath Kumar" IN CLEAN MINIMALIST SANS-SERIF */}
                <p className="font-sans-clean text-[11px] sm:text-xs md:text-sm font-medium tracking-[0.2em] sm:tracking-[0.25em] uppercase text-slate-700/90 mt-1 sm:mt-2">
                  With lots of love,
                  <br />
                  <span className="text-amber-900 font-semibold tracking-[0.25em] sm:tracking-[0.3em] inline-block mt-0.5">
                    Barath Kumar
                  </span>
                </p>
              </div>

              {/* Card Footer Hint / Tap to Open - Enhanced with Butterfly Trigger */}
              <div className="pb-1 sm:pb-2 flex flex-col items-center">
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    const rect = e.currentTarget.getBoundingClientRect();
                    triggerButterflies(rect.left + rect.width / 2, rect.top + rect.height / 2, 10);
                    soundEngine.playFlutterChime();
                    setIsFlipped(true);
                  }}
                  className="group relative inline-flex items-center gap-2 px-5 sm:px-6 py-2.5 sm:py-3 rounded-full bg-white/85 hover:bg-white text-slate-800 text-xs font-sans-clean font-semibold tracking-wider uppercase backdrop-blur-md border border-white shadow-md hover:shadow-lg transition-all duration-300 active:scale-95 touch-manipulation min-h-[44px]"
                >
                  <Eye className="w-4 h-4 text-rose-500 group-hover:scale-110 transition-transform" />
                  <span>Tap to Open Letter</span>
                  <span className="text-amber-500 font-bold ml-0.5">✦</span>
                </button>
                <p className="text-[9px] sm:text-[10px] font-sans-clean text-slate-500/80 mt-1.5 sm:mt-2 tracking-wider">
                  Tap to read inside letter & release butterflies
                </p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* INSIDE FACE OF THE CARD (REVEALED ON 3D FLIP)                             */}
          {/* ========================================================================= */}
          <div
            className={`absolute inset-0 w-full h-full rounded-[2.25rem] overflow-hidden glass-card-surface backface-hidden preserve-3d transition-shadow duration-500 ${
              !isFlipped ? 'pointer-events-none' : ''
            }`}
            style={{
              transform: 'rotateY(180deg)',
              boxShadow: `0 25px 60px -15px ${lightingStyles.cardAura}, 0 10px 25px -5px rgba(220, 245, 230, 0.4), inset 0 1px 3px rgba(255, 255, 255, 0.9)`,
            }}
          >
            {/* Soft Ambient Parchment Texture */}
            <div className="absolute inset-0 bg-gradient-to-br from-rose-50/60 via-purple-50/40 to-emerald-50/50 backdrop-blur-xl" />

            {/* Delicate Botanical Border Inset - Compact & Snug for Mobile */}
            <div className="absolute inset-2.5 sm:inset-4 rounded-[1.5rem] sm:rounded-[1.75rem] border border-white/80 bg-white/40 shadow-inner p-4 sm:p-7 flex flex-col justify-between overflow-y-auto">
              {/* Inside Header */}
              <div className="text-center">
                <div className="flex items-center justify-center gap-1.5 text-rose-400 mb-0.5 sm:mb-1">
                  <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-400 animate-pulse" />
                  <span className="text-[10px] sm:text-[11px] font-sans-clean uppercase tracking-[0.2em] sm:tracking-[0.25em] text-rose-800/80 font-medium">
                    To Our Dearest Amma
                  </span>
                  <Heart className="w-3.5 h-3.5 fill-rose-300 text-rose-400 animate-pulse" />
                </div>
                <h2 className="font-pinyon text-2xl sm:text-4xl text-amber-900/90 py-0.5 sm:py-1">
                  Amma Revathi
                </h2>
                <div className="w-14 sm:w-16 h-[1px] bg-gradient-to-r from-transparent via-amber-400 to-transparent mx-auto my-0.5 sm:my-1" />
              </div>

              {/* Heartfelt Note */}
              <div className="my-auto py-2 sm:py-3 text-center">
                <p className="font-cormorant text-sm sm:text-base md:text-lg leading-relaxed text-slate-800/90 italic font-normal px-1 sm:px-2">
                  {customMessage || (
                    <>
                      "Dearest Amma, thank you for your endless warmth, comforting hugs,
                      and the pure selfless grace you bring into our lives every single day.
                      May this birthday bless you with blooming health, tranquil peace,
                      laughter, and all the radiant happiness your heart can hold."
                    </>
                  )}
                </p>

                {/* Blessing Attributes Pill Cluster (Clean Unboxed Separators) */}
                <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[11px] sm:text-xs font-sans-clean text-slate-600 mt-3 sm:mt-4">
                  <span className="text-rose-700 font-medium">Radiant Health</span>
                  <span aria-hidden="true" className="text-amber-400">·</span>
                  <span className="text-purple-700 font-medium">Endless Joy</span>
                  <span aria-hidden="true" className="text-amber-400">·</span>
                  <span className="text-emerald-700 font-medium">Peace of Mind</span>
                  <span aria-hidden="true" className="text-amber-400">·</span>
                  <span className="text-amber-700 font-medium">Eternal Blessings</span>
                </div>

                {/* Interactive Candle to Light & Make a Wish */}
                <div className="mt-3.5 sm:mt-5 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={handleLightCandle}
                    className={`group relative flex items-center gap-2 px-3.5 sm:px-4 py-2 rounded-full border transition-all duration-300 min-h-[44px] touch-manipulation active:scale-95 ${
                      isCandleLit
                        ? 'bg-amber-100/90 border-amber-300 shadow-md text-amber-900'
                        : 'bg-white/70 border-slate-200/80 hover:bg-white text-slate-700'
                    }`}
                  >
                    <div className="relative">
                      <Flame
                        className={`w-4 h-4 sm:w-5 sm:h-5 transition-colors ${
                          isCandleLit
                            ? 'text-amber-500 fill-amber-400 animate-bounce'
                            : 'text-slate-400 group-hover:text-amber-400'
                        }`}
                      />
                      {isCandleLit && (
                        <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400 blur-xs" />
                      )}
                    </div>
                    <span className="text-xs font-sans-clean font-medium tracking-wide">
                      {isCandleLit ? 'Wish Made! Flame is Glowing ✨' : 'Click to Light Birthday Candle'}
                    </span>
                  </button>
                  {isCandleLit && (
                    <p className="text-[10px] sm:text-[11px] font-sans-clean text-amber-700/80 mt-1 animate-fadeIn">
                      May every wish of yours come true, Amma!
                    </p>
                  )}
                </div>
              </div>

              {/* Inside Footer / Signature */}
              <div className="pt-2 border-t border-amber-200/40 flex items-center justify-between">
                <div className="text-left">
                  <p className="text-[9px] sm:text-[10px] font-sans-clean tracking-wider text-slate-500 uppercase">
                    With Infinite Love,
                  </p>
                  <p className="font-script text-xl sm:text-2xl text-amber-900 leading-none mt-0.5 sm:mt-1">
                    Barath Kumar
                  </p>
                </div>

                {/* Return to Front button */}
                <button
                  type="button"
                  onClick={handleFlipCard}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/80 hover:bg-white text-slate-700 text-xs font-sans-clean font-medium border border-slate-200 shadow-xs transition-colors min-h-[38px] active:scale-95 touch-manipulation"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Front View</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Floating Action Ribbon Below Card - Optimized for Mobile Thumb Reach */}
      <div className="mt-5 sm:mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-2.5 z-30 max-w-full px-1">
        {/* Celebrate / Shower Petals & Gold Dust */}
        <button
          type="button"
          onClick={triggerPetalCelebration}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 text-white font-sans-clean text-xs font-medium tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all min-h-[42px] touch-manipulation"
        >
          <Sparkles className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
          <span>Shower Petals</span>
        </button>

        {/* Spell Mom's Name with Swarm of Butterflies */}
        {onOpenNameFormation && (
          <button
            type="button"
            onClick={onOpenNameFormation}
            className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 hover:from-amber-400 hover:to-purple-400 text-slate-900 font-sans-clean text-xs font-bold tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all border border-white/90 min-h-[42px] touch-manipulation"
            title="Watch 100+ butterflies form Mom's name (Revathi)"
          >
            <span className="text-sm">🦋</span>
            <span>Spell "Revathi"</span>
          </button>
        )}

        {/* Release Pastel Butterflies */}
        <button
          type="button"
          onClick={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            triggerButterflies(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
          }}
          className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl bg-gradient-to-r from-purple-400 via-pink-300 to-emerald-300 text-slate-800 font-sans-clean text-xs font-semibold tracking-wide shadow-sm hover:shadow-md active:scale-95 transition-all border border-white/80 min-h-[42px] touch-manipulation"
          title="Release a swarm of fluttering 3D pastel butterflies"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-purple-700">
            <path d="M12 7c-2-4-8-4-9 1s3 8 9 4c6 4 10 1 9-4s-7-5-9-1z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 12c-2 2-6 5-6 8s5 2 6-3c1 5 6 3 6-3s-4-6-6-8z" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M12 5v14" strokeLinecap="round" />
          </svg>
          <span>Butterflies</span>
        </button>

        {/* Music Box / Birthday Chimes */}
        <button
          type="button"
          onClick={handleToggleMusic}
          className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 sm:py-2.5 rounded-xl font-sans-clean text-xs font-medium tracking-wide border transition-all min-h-[42px] touch-manipulation active:scale-95 ${
            isPlayingMusic
              ? 'bg-amber-100 text-amber-900 border-amber-300 shadow-sm'
              : 'bg-white/85 hover:bg-white text-slate-700 border-slate-200/80 shadow-xs'
          }`}
          title="Play celestial chime rendition of Happy Birthday"
        >
          <Volume2 className={`w-3.5 h-3.5 sm:w-4 sm:h-4 ${isPlayingMusic ? 'text-amber-600 animate-pulse' : 'text-slate-500'}`} />
          <span>{isPlayingMusic ? 'Playing...' : 'Play Music'}</span>
        </button>

        {/* Sound FX Mute Toggle */}
        <button
          type="button"
          onClick={handleToggleMute}
          className="p-2.5 rounded-xl bg-white/85 hover:bg-white text-slate-600 border border-slate-200/80 shadow-xs transition-colors min-h-[42px] min-w-[42px] flex items-center justify-center touch-manipulation active:scale-95"
          title={isMuted ? 'Unmute Sound' : 'Mute Sound'}
          aria-label={isMuted ? 'Unmute Sound' : 'Mute Sound'}
        >
          {isMuted ? <VolumeX className="w-4 h-4 text-rose-500" /> : <Volume2 className="w-4 h-4 text-emerald-600" />}
        </button>

        {/* Customize Wishes Button */}
        {onOpenPersonalize && (
          <button
            type="button"
            onClick={onOpenPersonalize}
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 sm:py-2.5 rounded-xl bg-white/85 hover:bg-white text-slate-700 font-sans-clean text-xs font-medium border border-slate-200/80 shadow-xs transition-colors min-h-[42px] touch-manipulation active:scale-95"
          >
            <span>Personalize</span>
          </button>
        )}
      </div>
    </div>
  );
};
