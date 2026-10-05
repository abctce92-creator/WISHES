import React, { useState } from 'react';
import { X, Sparkles, Check, Download, Heart } from 'lucide-react';
import { soundEngine } from '../utils/audio';

interface PersonalizeModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentMessage: string;
  onSaveMessage: (newMessage: string) => void;
  lightingMode: 'blush' | 'golden' | 'twilight';
  onSelectLighting: (mode: 'blush' | 'golden' | 'twilight') => void;
  onExportCard: () => void;
}

export const PersonalizeModal: React.FC<PersonalizeModalProps> = ({
  isOpen,
  onClose,
  currentMessage,
  onSaveMessage,
  lightingMode,
  onSelectLighting,
  onExportCard,
}) => {
  const [draftMessage, setDraftMessage] = useState(currentMessage);

  if (!isOpen) return null;

  const presets = [
    {
      title: 'Devoted Gratitude',
      text: 'Dearest Amma, thank you for your boundless grace, comforting warmth, and the selfless sacrifices that brighten every corner of our lives. May this year shower you with vibrant health, laughter, and endless peaceful moments.',
    },
    {
      title: 'Radiant Longevity & Joy',
      text: 'Happy Birthday, Amma! Your smile is our greatest strength and your blessings are our greatest treasure. Wishing you long healthy years filled with tranquility, love, and all the happiness you so richly deserve.',
    },
    {
      title: 'Gentle & Poetic',
      text: 'To our sweetest Amma Revathi — like a flower blooming with grace, you bring harmony and warmth wherever you are. May your special day be wrapped in soft joy, good health, and sweet surprises.',
    },
  ];

  const handleSave = () => {
    soundEngine.playSparkle();
    onSaveMessage(draftMessage);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/40 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-2xl border border-white/80 overflow-y-auto max-h-[92vh] text-slate-800">
        {/* Ambient Top Glow */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-gradient-to-r from-pink-300 via-purple-300 to-emerald-300" />

        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-full hover:bg-slate-100 text-slate-500 hover:text-slate-800 transition-colors"
          aria-label="Close modal"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 text-rose-500 mb-1">
            <Heart className="w-4 h-4 fill-rose-300" />
            <span className="text-xs font-sans-clean font-medium uppercase tracking-widest text-rose-700">
              Personalize Digital Card
            </span>
          </div>
          <h3 className="text-xl font-serif text-slate-900 font-semibold">
            Wishes for Amma Revathi
          </h3>
          <p className="text-xs text-slate-500 mt-1">
            Tailor the heartfelt note inside the 3D card or adjust the ambient lighting theme.
          </p>
        </div>

        {/* Lighting Palette Selector */}
        <div className="mb-5">
          <label className="block text-xs font-sans-clean font-semibold uppercase tracking-wider text-slate-700 mb-2">
            Ambient Studio Lighting
          </label>
          <div className="grid grid-cols-3 gap-2">
            {[
              {
                id: 'blush',
                label: 'Blush & Sage',
                colors: 'from-pink-200 via-purple-100 to-emerald-100',
              },
              {
                id: 'golden',
                label: 'Golden Hour',
                colors: 'from-amber-200 via-rose-100 to-emerald-100',
              },
              {
                id: 'twilight',
                label: 'Lavender Rose',
                colors: 'from-purple-200 via-pink-200 to-teal-100',
              },
            ].map((theme) => (
              <button
                key={theme.id}
                type="button"
                onClick={() => {
                  soundEngine.playSparkle();
                  onSelectLighting(theme.id as 'blush' | 'golden' | 'twilight');
                }}
                className={`flex flex-col items-center justify-center p-2.5 rounded-xl border text-xs font-sans-clean transition-all ${
                  lightingMode === theme.id
                    ? 'border-amber-400 bg-amber-50/50 shadow-xs ring-1 ring-amber-400 font-semibold text-slate-900'
                    : 'border-slate-200 bg-white/70 hover:bg-white text-slate-600'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full bg-gradient-to-tr ${theme.colors} border border-white shadow-xs mb-1.5`}
                />
                <span className="text-[11px] truncate">{theme.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Message Editor */}
        <div className="mb-4">
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-sans-clean font-semibold uppercase tracking-wider text-slate-700">
              Heartfelt Message Inside
            </label>
            <span className="text-[11px] text-slate-400">
              {draftMessage.length} characters
            </span>
          </div>
          <textarea
            value={draftMessage}
            onChange={(e) => setDraftMessage(e.target.value)}
            rows={4}
            className="w-full p-3.5 rounded-2xl border border-slate-200/90 bg-white/80 focus:bg-white text-sm text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-rose-300 font-cormorant text-base leading-relaxed resize-none shadow-xs"
            placeholder="Write your loving words for Amma..."
          />
        </div>

        {/* Preset Inspirations */}
        <div className="mb-6">
          <p className="text-[11px] font-sans-clean text-slate-500 mb-2 font-medium">
            Quick Wish Inspirations:
          </p>
          <div className="flex flex-wrap gap-1.5">
            {presets.map((preset) => (
              <button
                key={preset.title}
                type="button"
                onClick={() => {
                  soundEngine.playSparkle();
                  setDraftMessage(preset.text);
                }}
                className="text-xs px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-rose-50 text-slate-600 hover:text-rose-700 transition-colors border border-slate-200/60"
              >
                {preset.title}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <button
            type="button"
            onClick={() => {
              onExportCard();
              onClose();
            }}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-sans-clean font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 transition-colors"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            <span>Save Card Image</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-sans-clean font-medium text-slate-500 hover:text-slate-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSave}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl text-xs font-sans-clean font-semibold text-white bg-gradient-to-r from-rose-500 to-amber-500 hover:from-rose-600 hover:to-amber-600 shadow-md hover:shadow-lg transition-all"
            >
              <Check className="w-3.5 h-3.5" />
              <span>Update Card</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
