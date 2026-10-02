import React, { useState } from 'react';
import { Sparkles, Wand2, X, RefreshCw, Check } from 'lucide-react';
import { ThemeId } from '../types/card';

interface AiWishModalProps {
  isOpen: boolean;
  onClose: () => void;
  recipientName: string;
  senderName: string;
  age?: number;
  currentTheme: ThemeId;
  onApplyWish: (generated: {
    headline: string;
    message: string;
    questTitle?: string;
    specialQuote?: string;
    balloonNotes?: string[];
    giftBoxNote?: string;
  }) => void;
}

export const AiWishModal: React.FC<AiWishModalProps> = ({
  isOpen,
  onClose,
  recipientName,
  senderName,
  age,
  currentTheme,
  onApplyWish,
}) => {
  if (!isOpen) return null;

  const [tone, setTone] = useState<string>('Sweet & Heartwarming');
  const [relationship, setRelationship] = useState<string>('Best Friend');
  const [interests, setInterests] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<{
    headline: string;
    message: string;
    questTitle?: string;
    specialQuote?: string;
    suggestedBalloonNotes?: string[];
    giftBoxNote?: string;
  } | null>(null);

  const tones = [
    'Sweet & Heartwarming',
    'Funny & Friendly Roast',
    'Arcade 8-Bit Gamer Quest',
    'Romantic & Dreamy',
    'Poetic & Cinematic',
    'Hype Party & Legend'
  ];

  const relationships = [
    'Best Friend',
    'Romantic Partner',
    'Sibling / Cousin',
    'Colleague / Teammate',
    'Parent / Elder'
  ];

  const handleGenerate = async () => {
    setIsLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch('/api/generate-wish', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          recipientName,
          senderName,
          age,
          tone,
          interests: `Relationship: ${relationship}. Interests/Memories: ${interests}`,
          theme: currentTheme,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || 'Failed to generate wish');
      }

      setResult(data);
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Error communicating with AI Assistant');
    } finally {
      setIsLoading(false);
    }
  };

  const handleApply = () => {
    if (!result) return;
    onApplyWish({
      headline: result.headline,
      message: result.message,
      questTitle: result.questTitle,
      specialQuote: result.specialQuote,
      balloonNotes: result.suggestedBalloonNotes,
      giftBoxNote: result.giftBoxNote,
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm animate-fade-in">
      <div className="w-full max-w-lg rounded-3xl border border-slate-700 bg-slate-900 p-6 shadow-2xl text-slate-100 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-pink-500/20 text-pink-400 border border-pink-500/30">
              <Sparkles className="h-5 w-5 animate-pulse" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">AI Birthday Wish Assistant</h2>
              <p className="text-xs text-slate-400">Craft personalized messages with Gemini AI</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-800 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Form Inputs */}
        <div className="mt-4 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Relationship to {recipientName || 'Recipient'}
            </label>
            <div className="flex flex-wrap gap-1.5">
              {relationships.map((rel) => (
                <button
                  key={rel}
                  type="button"
                  onClick={() => setRelationship(rel)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    relationship === rel
                      ? 'bg-pink-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {rel}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1.5">
              Desired Message Tone
            </label>
            <div className="flex flex-wrap gap-1.5">
              {tones.map((t) => (
                <button
                  key={t}
                  type="button"
                  onClick={() => setTone(t)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    tone === t
                      ? 'bg-cyan-600 text-white shadow-sm'
                      : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Special Memories, Hobbies, or Inside Jokes (Optional)
            </label>
            <input
              type="text"
              value={interests}
              onChange={(e) => setInterests(e.target.value)}
              placeholder="e.g., Loves pizza, road trips, Mario Kart, staying up late"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
            />
          </div>

          <button
            onClick={handleGenerate}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-pink-500 via-purple-500 to-indigo-500 py-2.5 font-bold text-xs text-white shadow-lg hover:opacity-90 disabled:opacity-50 transition-opacity"
          >
            {isLoading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                <span>Generating Magic Wish with Gemini...</span>
              </>
            ) : (
              <>
                <Wand2 className="h-4 w-4" />
                <span>Generate Wish with Gemini AI</span>
              </>
            )}
          </button>

          {errorMsg && (
            <div className="p-3 rounded-xl bg-rose-950/60 border border-rose-500/40 text-xs text-rose-300">
              {errorMsg}
            </div>
          )}

          {/* Generated Result Preview */}
          {result && (
            <div className="mt-4 p-4 rounded-2xl bg-slate-950 border border-pink-500/40 space-y-3 animate-fade-in">
              <div className="flex items-center justify-between text-xs font-bold text-pink-400">
                <span>AI Wish Preview</span>
                <span className="text-[10px] text-slate-500">Gemini 3.8 Flash</span>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Headline</span>
                <p className="text-sm font-bold text-white">{result.headline}</p>
              </div>

              <div>
                <span className="text-[10px] uppercase tracking-wider text-slate-500">Message</span>
                <p className="text-xs text-slate-200 leading-relaxed bg-slate-900/80 p-2.5 rounded-lg border border-slate-800">
                  {result.message}
                </p>
              </div>

              {result.specialQuote && (
                <div>
                  <span className="text-[10px] uppercase tracking-wider text-slate-500">Motto / Quote</span>
                  <p className="text-xs italic text-amber-300">"{result.specialQuote}"</p>
                </div>
              )}

              <button
                onClick={handleApply}
                className="w-full flex items-center justify-center gap-2 rounded-xl bg-emerald-600 py-2 font-bold text-xs text-white shadow hover:bg-emerald-500 transition-colors"
              >
                <Check className="h-4 w-4" />
                <span>Apply AI Wish to Card Form</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
