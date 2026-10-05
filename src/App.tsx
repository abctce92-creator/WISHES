import React, { useState, useRef } from 'react';
import {
  Sparkles,
  Heart,
  Volume2,
  VolumeX,
  Share2,
  Download,
  Gift,
  Flame,
  Flower2,
  Sliders,
  Send,
  CheckCircle2,
} from 'lucide-react';
import { Card3D } from './components/Card3D';
import { SparkleDustCanvas } from './components/SparkleDustCanvas';
import { ButterflyEffect, triggerButterflies } from './components/ButterflyEffect';
import { triggerPetalCelebration } from './components/PetalShower';
import { soundEngine } from './utils/audio';
import { PersonalizeModal } from './components/PersonalizeModal';
import { exportCardAsImage } from './utils/exportCard';
import { ButterflyNameFormation } from './components/ButterflyNameFormation';

export default function App() {
  const [lightingMode, setLightingMode] = useState<'blush' | 'golden' | 'twilight'>('blush');
  const [isPersonalizeOpen, setIsPersonalizeOpen] = useState(false);
  const [isNameFormationOpen, setIsNameFormationOpen] = useState(false);
  const [customMessage, setCustomMessage] = useState(
    'Dearest Amma, thank you for your boundless grace, comforting warmth, and the selfless love that brightens every corner of our lives. May this year shower you with vibrant health, serene peace, sweet laughter, and all the radiant happiness your heart can hold.'
  );
  const [copyFeedback, setCopyFeedback] = useState(false);
  const [isPlayingMusic, setIsPlayingMusic] = useState(false);
  const [isMuted, setIsMuted] = useState(false);

  const cardRef = useRef<HTMLDivElement | null>(null);

  const handleExport = () => {
    soundEngine.playSparkle();
    exportCardAsImage(cardRef.current, 'Happy_Birthday_Amma_Revathi.png');
  };

  const handleShareLink = () => {
    soundEngine.playSparkle();
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopyFeedback(true);
      setTimeout(() => setCopyFeedback(false), 3000);
    }
  };

  const handleToggleMelody = () => {
    if (isPlayingMusic) {
      soundEngine.stopMelody();
      setIsPlayingMusic(false);
    } else {
      setIsPlayingMusic(true);
      soundEngine.playBirthdayMelody(() => setIsPlayingMusic(false));
    }
  };

  const handleToggleMute = () => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    soundEngine.setMuted(nextMuted);
    if (nextMuted && isPlayingMusic) {
      setIsPlayingMusic(false);
    }
  };

  return (
    <div className="relative min-h-screen w-full bg-[#faf7f5] text-[#2d2727] font-sans-clean overflow-x-hidden selection:bg-pink-200 selection:text-pink-900">
      {/* Interactive Golden Sparkle Dust Canvas (Drifting stardust & cursor fairy dust) */}
      <SparkleDustCanvas />

      {/* 3D Fluttering Butterfly Animation for Button Clicks and Interactive Spawns */}
      <ButterflyEffect />

      {/* Atmospheric Ambient Floral Backdrop with Soft Studio Lighting */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
        {/* Ambient Generated Backdrop Image with Atmospheric Blend */}
        <img
          src="/src/assets/images/floral_ambient_backdrop_1791202450103.jpg"
          alt="Ambient floral studio backdrop"
          referrerPolicy="no-referrer"
          className="w-full h-full object-cover object-center opacity-30 mix-blend-multiply filter blur-[32px] scale-110"
        />

        {/* Soft Aesthetic Color Gradients: Blush Pink, Warm Lavender, Sage Green */}
        <div className="absolute -top-32 -left-32 w-[650px] h-[650px] rounded-full bg-gradient-to-br from-pink-200/50 via-rose-100/40 to-transparent blur-[100px] animate-pulse-glow" />
        <div className="absolute top-1/4 -right-32 w-[600px] h-[600px] rounded-full bg-gradient-to-bl from-purple-200/45 via-indigo-100/35 to-transparent blur-[110px] animate-float-reverse" />
        <div className="absolute -bottom-32 left-1/3 w-[700px] h-[700px] rounded-full bg-gradient-to-tr from-emerald-100/50 via-teal-50/40 to-transparent blur-[120px] animate-float-slow" />
      </div>

      {/* ========================================================================= */}
      {/* TOP NAVIGATION BAR (Strict 3-zone Top Bar Contract)                       */}
      {/* ========================================================================= */}
      <header className="relative z-30 flex items-center justify-between px-3.5 sm:px-10 py-3 sm:py-4.5 border-b border-pink-100/80 bg-white/70 backdrop-blur-md">
        {/* Zone 1: Single text element wordmark in display face */}
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            soundEngine.playSparkle();
          }}
          className="font-script text-xl sm:text-3xl text-amber-900 hover:text-amber-800 transition-colors tracking-wide shrink-0"
        >
          Amma Revathi
        </a>

        {/* Zone 2: 4 clean text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-xs font-medium tracking-wider uppercase text-slate-600">
          <a
            href="#card-section"
            className="hover:text-amber-900 transition-colors"
          >
            Digital Card
          </a>
          <a
            href="#tribute-section"
            className="hover:text-amber-900 transition-colors"
          >
            Loving Tribute
          </a>
          <a
            href="#blessings-section"
            className="hover:text-amber-900 transition-colors"
          >
            Birthday Wishes
          </a>
          <button
            type="button"
            onClick={() => setIsPersonalizeOpen(true)}
            className="hover:text-amber-900 transition-colors inline-flex items-center gap-1 cursor-pointer"
          >
            <span>Personalize</span>
            <Sliders className="w-3 h-3 text-amber-600" />
          </button>
        </nav>

        {/* Zone 3: 1-2 primary actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          <button
            type="button"
            onClick={() => setIsNameFormationOpen(true)}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-semibold text-amber-950 bg-gradient-to-r from-amber-200 via-rose-200 to-purple-200 hover:from-amber-300 hover:to-purple-300 border border-amber-300/80 shadow-2xs active:scale-95 transition-all touch-manipulation"
            title="Watch 100+ butterflies form Mom's name"
          >
            <span>🦋</span>
            <span className="hidden sm:inline">Spell "Revathi"</span>
            <span className="sm:hidden">Name</span>
          </button>

          <button
            type="button"
            onClick={triggerPetalCelebration}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-white bg-gradient-to-r from-rose-400 via-pink-400 to-purple-400 hover:from-rose-500 hover:to-purple-500 shadow-xs hover:shadow-sm active:scale-95 transition-all touch-manipulation"
            title="Shower rose petals and golden sparkles"
          >
            <Sparkles className="w-3 h-3 sm:w-3.5 sm:h-3.5" />
            <span className="hidden sm:inline">Shower Petals</span>
            <span className="sm:hidden">Petals</span>
          </button>

          <button
            type="button"
            onClick={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              triggerButterflies(rect.left + rect.width / 2, rect.top + rect.height / 2, 7);
            }}
            className="inline-flex items-center gap-1 sm:gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-full text-[11px] sm:text-xs font-medium text-purple-900 bg-purple-100/90 hover:bg-purple-200/90 border border-purple-200/70 shadow-2xs active:scale-95 transition-colors touch-manipulation"
            title="Release fluttering 3D pastel butterflies"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-3 h-3 sm:w-3.5 sm:h-3.5 text-purple-600">
              <path d="M12 7c-2-4-8-4-9 1s3 8 9 4c6 4 10 1 9-4s-7-5-9-1z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 12c-2 2-6 5-6 8s5 2 6-3c1 5 6 3 6-3s-4-6-6-8z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 5v14" strokeLinecap="round" />
            </svg>
            <span className="hidden sm:inline">Butterflies</span>
            <span className="sm:hidden">Flutter</span>
          </button>

          <button
            type="button"
            onClick={handleExport}
            className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-medium text-slate-700 bg-white/80 hover:bg-white border border-slate-200/80 shadow-2xs transition-colors"
            title="Download high-resolution card"
          >
            <Download className="w-3.5 h-3.5 text-slate-500" />
            <span>Save PNG</span>
          </button>

          <button
            type="button"
            onClick={handleToggleMute}
            className="p-1.5 rounded-full text-slate-500 hover:text-slate-800 bg-white/60 hover:bg-white border border-slate-200/60 transition-colors touch-manipulation active:scale-95"
            title={isMuted ? 'Unmute' : 'Mute'}
            aria-label={isMuted ? 'Unmute' : 'Mute'}
          >
            {isMuted ? (
              <VolumeX className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-rose-500" />
            ) : (
              <Volume2 className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600" />
            )}
          </button>
        </div>
      </header>

      {/* Main Experience Container */}
      <main className="relative z-20">
        {/* ========================================================================= */}
        {/* HERO STAGE: 3D PASTEL FLORAL GLASSMORPHISM BIRTHDAY CARD                  */}
        {/* ========================================================================= */}
        <section
          id="card-section"
          className="relative pt-3 sm:pt-8 pb-10 sm:pb-16 px-2 sm:px-4 flex flex-col items-center justify-center min-h-[calc(100vh-65px)]"
        >
          {/* Subtle Ambient Title Kicker (Zero-Pill Clean Typography) */}
          <div className="flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 text-[10px] sm:text-xs font-sans-clean font-medium tracking-[0.18em] sm:tracking-[0.25em] uppercase text-rose-800/70 mb-2 sm:mb-4 text-center px-2">
            <span>Special Birthday Edition</span>
            <span aria-hidden="true" className="text-amber-400">·</span>
            <span>Handcrafted with Love</span>
            <span aria-hidden="true" className="text-amber-400">·</span>
            <span>October 2026</span>
          </div>

          {/* Interactive 3D Card Masterpiece */}
          <Card3D
            cardRef={cardRef}
            customMessage={customMessage}
            lightingMode={lightingMode}
            onOpenPersonalize={() => setIsPersonalizeOpen(true)}
            onOpenNameFormation={() => setIsNameFormationOpen(true)}
          />

          {/* Secondary Quick Share / Status Toast */}
          {copyFeedback && (
            <div className="mt-3 inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-slate-900 text-white text-xs font-medium shadow-lg animate-fadeIn max-w-[90%] text-center">
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Card URL copied to clipboard! Share with family.</span>
            </div>
          )}
        </section>

        {/* ========================================================================= */}
        {/* LOVING TRIBUTE & BLESSINGS SECTION                                        */}
        {/* ========================================================================= */}
        <section
          id="tribute-section"
          className="relative py-12 sm:py-20 px-4 sm:px-12 max-w-5xl mx-auto border-t border-pink-100/60"
        >
          <div className="text-center max-w-2xl mx-auto mb-10 sm:mb-14 px-2">
            <p className="text-[10px] sm:text-xs font-sans-clean tracking-[0.2em] sm:tracking-[0.25em] uppercase text-amber-800 font-semibold mb-1.5 sm:mb-2">
              A Symphony of Gratitude
            </p>
            <h2 className="font-serif text-2xl sm:text-4xl text-slate-900 font-normal">
              To Our Beloved Mother, <span className="font-script text-3xl sm:text-5xl text-amber-900 gold-subtle-text block sm:inline mt-1 sm:mt-0">Amma Revathi</span>
            </h2>
            <p className="font-cormorant text-slate-600 italic text-sm sm:text-lg mt-2 sm:mt-3 leading-relaxed">
              "A mother's love is the gentle garden where happiness takes root and blooms into a lifetime of blessings."
            </p>
          </div>

          {/* Clean 3-Column Glassmorphism Bento Grid (Airy & Single-Elevation) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Card 1: Boundless Grace */}
            <div className="rounded-3xl p-7 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_30px_rgba(240,210,225,0.25)] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-rose-100/70 border border-rose-200/60 flex items-center justify-center text-rose-600 mb-5">
                <Heart className="w-5 h-5 fill-rose-200" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-slate-900 mb-2">
                Boundless Maternal Warmth
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans-clean">
                Your reassuring voice and quiet strength turn every hardship into comfort. No matter where life leads, your loving embrace is always home.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-rose-800/80 font-medium">
                Unconditional & Pure
              </div>
            </div>

            {/* Card 2: Serene Wisdom */}
            <div className="rounded-3xl p-7 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_30px_rgba(225,215,245,0.25)] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-purple-100/70 border border-purple-200/60 flex items-center justify-center text-purple-600 mb-5">
                <Flower2 className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-slate-900 mb-2">
                Gentle Strength & Harmony
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans-clean">
                Like botanical blossoms that bloom season after season, you bring steady grace, moral clarity, and joy into every corner of our family.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-purple-800/80 font-medium">
                Pillar of Our Family
              </div>
            </div>

            {/* Card 3: Eternal Wishes */}
            <div className="rounded-3xl p-7 bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_10px_30px_rgba(210,240,225,0.25)] hover:shadow-md transition-shadow">
              <div className="w-10 h-10 rounded-2xl bg-emerald-100/70 border border-emerald-200/60 flex items-center justify-center text-emerald-600 mb-5">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-serif text-lg font-semibold text-slate-900 mb-2">
                Long Health & Sweet Smiles
              </h3>
              <p className="text-sm text-slate-600 leading-relaxed font-sans-clean">
                Praying for endless healthy days, serene morning prayers, delightful laughter, and peaceful milestones filled with warmth and pride.
              </p>
              <div className="mt-4 pt-4 border-t border-slate-100 text-xs text-emerald-800/80 font-medium">
                Forever Blessed
              </div>
            </div>
          </div>

          {/* Personal Dedication Banner */}
          <div
            id="blessings-section"
            className="mt-14 rounded-3xl p-8 sm:p-10 bg-gradient-to-r from-pink-50/70 via-purple-50/50 to-emerald-50/60 backdrop-blur-xl border border-white/90 text-center relative overflow-hidden"
          >
            <div className="max-w-xl mx-auto relative z-10">
              <span className="text-[11px] font-sans-clean uppercase tracking-[0.25em] text-amber-800 font-semibold">
                From Barath Kumar
              </span>
              <p className="font-cormorant text-xl sm:text-2xl text-slate-800 italic mt-2 leading-relaxed">
                "Happy Birthday, my wonderful Amma. Thank you for being my constant guide, my biggest blessing, and the sweetest soul I will ever know."
              </p>
              <p className="font-script text-3xl sm:text-4xl text-amber-900 mt-4 leading-none">
                With lots of love, Barath Kumar
              </p>

              {/* Celebration CTAs */}
              <div className="mt-6 sm:mt-7 flex flex-wrap items-center justify-center gap-2.5 sm:gap-3">
                <button
                  type="button"
                  onClick={() => setIsNameFormationOpen(true)}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold text-slate-900 bg-gradient-to-r from-amber-300 via-rose-300 to-purple-300 hover:from-amber-400 hover:to-purple-400 border border-white/90 shadow-md hover:shadow-lg active:scale-95 transition-all min-h-[42px] touch-manipulation"
                >
                  <span className="text-sm">🦋</span>
                  <span>Butterflies Form "Revathi"</span>
                </button>

                <button
                  type="button"
                  onClick={triggerPetalCelebration}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold text-white bg-gradient-to-r from-rose-500 via-pink-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md hover:shadow-lg active:scale-95 transition-all min-h-[42px] touch-manipulation"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>Shower Blessings & Flowers</span>
                </button>

                <button
                  type="button"
                  onClick={(e) => {
                    const rect = e.currentTarget.getBoundingClientRect();
                    triggerButterflies(rect.left + rect.width / 2, rect.top + rect.height / 2, 8);
                  }}
                  className="inline-flex items-center gap-2 px-4 sm:px-5 py-2.5 rounded-full text-xs font-semibold text-slate-800 bg-gradient-to-r from-purple-200 via-pink-200 to-emerald-200 hover:from-purple-300 hover:to-pink-300 border border-white/80 shadow-md hover:shadow-lg active:scale-95 transition-all min-h-[42px] touch-manipulation"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4 h-4 text-purple-700">
                    <path d="M12 7c-2-4-8-4-9 1s3 8 9 4c6 4 10 1 9-4s-7-5-9-1z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 12c-2 2-6 5-6 8s5 2 6-3c1 5 6 3 6-3s-4-6-6-8z" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M12 5v14" strokeLinecap="round" />
                  </svg>
                  <span>Release Butterflies</span>
                </button>

                <button
                  type="button"
                  onClick={handleExport}
                  className="inline-flex items-center gap-2 px-4 py-2.5 rounded-full text-xs font-medium text-slate-700 bg-white hover:bg-slate-50 border border-slate-200/90 shadow-xs active:scale-95 transition-colors min-h-[42px] touch-manipulation"
                >
                  <Download className="w-4 h-4 text-slate-500" />
                  <span>Download High-Res Card Image</span>
                </button>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* ========================================================================= */}
      {/* FOOTER (Quiet, clean typography without telemetry clutter)                */}
      {/* ========================================================================= */}
      <footer className="relative z-20 py-8 px-6 border-t border-pink-100/70 bg-white/40 backdrop-blur-sm text-center">
        <div className="max-w-md mx-auto flex flex-col items-center gap-2">
          <p className="font-script text-2xl text-amber-900/90">
            Happy Birthday, Amma Revathi!
          </p>
          <div className="flex items-center gap-2 text-xs text-slate-500 font-sans-clean">
            <span>Lovingly Designed by Barath Kumar</span>
            <span aria-hidden="true">·</span>
            <span>3D Pastel Floral Edition</span>
            <span aria-hidden="true">·</span>
            <span>Always & Forever</span>
          </div>
        </div>
      </footer>

      {/* Personalization & Lighting Modal */}
      <PersonalizeModal
        isOpen={isPersonalizeOpen}
        onClose={() => setIsPersonalizeOpen(false)}
        currentMessage={customMessage}
        onSaveMessage={(msg) => setCustomMessage(msg)}
        lightingMode={lightingMode}
        onSelectLighting={(mode) => setLightingMode(mode)}
        onExportCard={handleExport}
      />

      {/* Butterfly Constellation forming Mom's name: REVATHI / AMMA REVATHI */}
      <ButterflyNameFormation
        isOpen={isNameFormationOpen}
        onClose={() => setIsNameFormationOpen(false)}
        defaultText="REVATHI"
      />
    </div>
  );
}
