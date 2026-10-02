import React, { useState } from 'react';
import { CardData, ThemeId, MusicTrack } from '../types/card';
import {
  Music,
  Palette,
  Gift,
  Flame,
  User,
  Share2,
  Eye,
  Edit3,
  Plus,
  Trash2,
  Check,
  Zap,
} from 'lucide-react';

interface CardBuilderProps {
  initialCard: CardData;
  onSaveAndShare: (card: CardData) => void;
  onPreviewLive: (card: CardData) => void;
  onLoadPreset: (theme: ThemeId) => void;
}

export const CardBuilder: React.FC<CardBuilderProps> = ({
  initialCard,
  onSaveAndShare,
  onPreviewLive,
  onLoadPreset,
}) => {
  const [card, setCard] = useState<CardData>(initialCard);
  const [activeTab, setActiveTab] = useState<'details' | 'theme' | 'content' | 'treats'>('details');

  // New Memory Input
  const [newMemory, setNewMemory] = useState('');

  const themes: { id: ThemeId; label: string; icon: string; desc: string }[] = [
    { id: 'arcade', label: 'Retro Arcade', icon: '🕹️', desc: '8-bit pixels & chiptune quest style' },
    { id: 'romantic', label: 'Romantic Rose', icon: '🌹', desc: 'Soft pink, falling petals & acoustic warmth' },
    { id: 'cyberpunk', label: 'Cyber Neon', icon: '⚡', desc: 'Futuristic HUD, cyan glow & synthwave' },
    { id: 'galaxy', label: 'Galactic Stars', icon: '🌌', desc: 'Cosmic nebula, constellation wishes' },
    { id: 'pastel', label: 'Cozy Pastel', icon: '🧁', desc: 'Sweet boba, cheerful balloons & polka dots' },
    { id: 'luxury', label: 'Luxury Gold', icon: '🥂', desc: 'Obsidian black, gold foil & champagne' },
  ];

  const musicTracks: { id: MusicTrack; label: string }[] = [
    { id: 'arcade', label: '👾 8-Bit Chiptune Synth' },
    { id: 'romantic', label: '🎸 Romantic Acoustic Arpeggio' },
    { id: 'party', label: '🎺 Upbeat Celebration Brass' },
    { id: 'cosmic', label: '🌌 Ethereal Cosmic Space Pad' },
    { id: 'lofi', label: '☕ Warm Lofi Chill Keys' },
    { id: 'none', label: '🔇 Silent Mode (No Music)' },
  ];

  const updateCardField = <K extends keyof CardData>(field: K, value: CardData[K]) => {
    setCard((prev) => ({ ...prev, [field]: value }));
  };

  const addMemory = () => {
    if (!newMemory.trim()) return;
    updateCardField('memories', [...(card.memories || []), newMemory.trim()]);
    setNewMemory('');
  };

  const removeMemory = (idx: number) => {
    updateCardField(
      'memories',
      (card.memories || []).filter((_, i) => i !== idx)
    );
  };

  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const file = files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        updateCardField('photos', [...(card.photos || []), base64]);
      }
    };
    reader.readAsDataURL(file);
  };

  const removePhoto = (idx: number) => {
    updateCardField(
      'photos',
      (card.photos || []).filter((_, i) => i !== idx)
    );
  };

  return (
    <div className="w-full max-w-xl mx-auto p-4 sm:p-6 space-y-6">
      {/* Top Title Banner */}
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-black text-white">
          Craft a Sweet Birthday Card
        </h1>
        <p className="text-xs text-slate-400">
          Customize themes, candle blowing, balloon popping, and background music!
        </p>
      </div>

      {/* Preset Quick Load Buttons */}
      <div className="p-3 bg-slate-900/80 rounded-2xl border border-slate-800 backdrop-blur-md">
        <span className="block text-[11px] font-semibold text-slate-400 mb-2 flex items-center gap-1">
          <Zap className="h-3.5 w-3.5 text-amber-400" />
          Quick Load Sample Theme Template:
        </span>
        <div className="flex flex-wrap gap-1.5">
          {themes.map((t) => (
            <button
              key={t.id}
              onClick={() => onLoadPreset(t.id)}
              className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors border border-slate-700/80"
            >
              {t.icon} {t.label}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-2xl bg-slate-900 p-1.5 border border-slate-800 text-xs font-bold">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-colors ${
            activeTab === 'details'
              ? 'bg-pink-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span>1. People</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-colors ${
            activeTab === 'theme'
              ? 'bg-pink-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span>2. Theme</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-colors ${
            activeTab === 'content'
              ? 'bg-pink-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span>3. Message</span>
        </button>

        <button
          onClick={() => setActiveTab('treats')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-colors ${
            activeTab === 'treats'
              ? 'bg-pink-600 text-white shadow'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <Gift className="h-3.5 w-3.5" />
          <span>4. Treats</span>
        </button>
      </div>

      {/* TAB 1: RECIPIENT & DETAILS */}
      {activeTab === 'details' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 backdrop-blur-md">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Recipient's Name *
              </label>
              <input
                type="text"
                value={card.recipientName}
                onChange={(e) => updateCardField('recipientName', e.target.value)}
                placeholder="e.g. Sarah, Alex, Mom"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Your Name (Sender) *
              </label>
              <input
                type="text"
                value={card.senderName}
                onChange={(e) => updateCardField('senderName', e.target.value)}
                placeholder="e.g. Leo & Friends"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Age Turning (Optional)
              </label>
              <input
                type="number"
                min={1}
                max={120}
                value={card.age || ''}
                onChange={(e) =>
                  updateCardField('age', e.target.value ? parseInt(e.target.value) : undefined)
                }
                placeholder="e.g. 25"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Custom Honorific / Badge
              </label>
              <input
                type="text"
                value={card.customBadge || ''}
                onChange={(e) => updateCardField('customBadge', e.target.value)}
                placeholder="e.g. PLAYER 1, BIRTHDAY QUEEN, VIP"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THEMES & MUSIC */}
      {activeTab === 'theme' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 backdrop-blur-md">
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-3">
              Select Card Theme Visual Language
            </label>
            <div className="grid grid-cols-2 gap-3">
              {themes.map((t) => {
                const isSelected = card.theme === t.id;
                return (
                  <button
                    key={t.id}
                    onClick={() => {
                      updateCardField('theme', t.id);
                      // Auto select matching track
                      if (t.id === 'arcade') updateCardField('musicTrack', 'arcade');
                      else if (t.id === 'romantic') updateCardField('musicTrack', 'romantic');
                      else if (t.id === 'cyberpunk') updateCardField('musicTrack', 'party');
                      else if (t.id === 'galaxy') updateCardField('musicTrack', 'cosmic');
                      else if (t.id === 'pastel') updateCardField('musicTrack', 'lofi');
                    }}
                    className={`flex flex-col items-start p-3.5 rounded-2xl text-left border transition-all ${
                      isSelected
                        ? 'bg-pink-600/20 border-pink-500 ring-2 ring-pink-500/30'
                        : 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <span className="text-2xl mb-1">{t.icon}</span>
                    <span className="text-xs font-bold text-white">{t.label}</span>
                    <span className="text-[10px] text-slate-400 leading-tight mt-0.5">{t.desc}</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Music className="h-4 w-4 text-cyan-400" />
              <span>Background Synthesizer Audio Track</span>
            </label>
            <div className="space-y-1.5">
              {musicTracks.map((m) => (
                <button
                  key={m.id}
                  onClick={() => updateCardField('musicTrack', m.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors ${
                    card.musicTrack === m.id
                      ? 'bg-cyan-600/20 border border-cyan-500 text-cyan-300'
                      : 'bg-slate-950/60 border border-slate-800 text-slate-300 hover:bg-slate-800'
                  }`}
                >
                  <span>{m.label}</span>
                  {card.musicTrack === m.id && <Check className="h-4 w-4 text-cyan-400" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MESSAGE & CONTENT */}
      {activeTab === 'content' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-4 backdrop-blur-md">
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Card Headline / Main Title
            </label>
            <input
              type="text"
              value={card.headline}
              onChange={(e) => updateCardField('headline', e.target.value)}
              placeholder="e.g. LEVEL UP! Alex is now Level 25"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none font-bold"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Main Birthday Wish Message
            </label>
            <textarea
              rows={4}
              value={card.message}
              onChange={(e) => updateCardField('message', e.target.value)}
              placeholder="Write your sweet, funny, or poetic birthday message..."
              className="w-full rounded-xl border border-slate-700 bg-slate-950 p-3 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none leading-relaxed"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Sub-Title / Quest Title
              </label>
              <input
                type="text"
                value={card.questTitle || ''}
                onChange={(e) => updateCardField('questTitle', e.target.value)}
                placeholder="e.g. Quest: Cake Annihilation"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-300 mb-1">
                Special Birthday Quote
              </label>
              <input
                type="text"
                value={card.specialQuote || ''}
                onChange={(e) => updateCardField('specialQuote', e.target.value)}
                placeholder="e.g. High Score Achieved!"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
              />
            </div>
          </div>

          {/* Memories List */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Shared Memories & Inside Jokes
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                placeholder="Add a memory (e.g. 3 AM LAN party)"
                className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
              />
              <button
                onClick={addMemory}
                className="flex items-center gap-1 rounded-xl bg-pink-600 px-3 py-2 text-xs font-bold text-white hover:bg-pink-500"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {(card.memories || []).map((mem, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-200"
                >
                  <span>• {mem}</span>
                  <button
                    onClick={() => removeMemory(idx)}
                    className="text-slate-500 hover:text-rose-400 p-1"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: INTERACTIVE TREATS */}
      {activeTab === 'treats' && (
        <div className="p-5 rounded-3xl bg-slate-900/90 border border-slate-800 space-y-5 backdrop-blur-md">
          {/* Cake Candles */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-400" />
              <span>Candles on Birthday Cake (1 to 10)</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={10}
                value={card.candleCount}
                onChange={(e) => updateCardField('candleCount', parseInt(e.target.value))}
                className="w-full accent-pink-500"
              />
              <span className="font-extrabold text-sm text-pink-300 w-8">
                {card.candleCount}
              </span>
            </div>

            <label className="mt-3 flex items-center gap-2 text-xs text-slate-300 cursor-pointer">
              <input
                type="checkbox"
                checked={card.enableMicBlow}
                onChange={(e) => updateCardField('enableMicBlow', e.target.checked)}
                className="rounded border-slate-700 bg-slate-950 text-pink-600 focus:ring-pink-500"
              />
              <span>Allow blowing into microphone to extinguish candles 🎙️</span>
            </label>
          </div>

          {/* Gift Box Surprise */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              🎁 Surprise Message inside Unboxing Present
            </label>
            <input
              type="text"
              value={card.giftBoxMessage}
              onChange={(e) => updateCardField('giftBoxMessage', e.target.value)}
              placeholder="e.g. 🎁 1x Unlimited Pizza Pass & Movie Night!"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* Scratch Card Secret */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              ✨ Scratch Card Fortune Secret Voucher
            </label>
            <input
              type="text"
              value={card.scratchCardSecret}
              onChange={(e) => updateCardField('scratchCardSecret', e.target.value)}
              placeholder="e.g. 🎟️ Free Coffee & Homemade Cake on Me!"
              className="w-full rounded-xl border border-slate-700 bg-slate-950 px-3 py-2 text-xs text-white placeholder-slate-500 focus:border-pink-500 focus:outline-none"
            />
          </div>

          {/* Photos Upload */}
          <div>
            <label className="block text-xs font-semibold text-slate-300 mb-1">
              Upload Memory Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="block w-full text-xs text-slate-400 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-pink-600 file:text-white hover:file:bg-pink-500"
            />

            {(card.photos || []).length > 0 && (
              <div className="flex gap-2 mt-2">
                {card.photos.map((p, i) => (
                  <div key={i} className="relative h-16 w-16 rounded-xl overflow-hidden border border-slate-700">
                    <img src={p} alt="Uploaded" className="h-full w-full object-cover" />
                    <button
                      onClick={() => removePhoto(i)}
                      className="absolute top-1 right-1 p-0.5 rounded-full bg-black/70 text-white hover:bg-rose-600"
                    >
                      <Trash2 className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Action Buttons: Preview & Generate Share Link */}
      <div className="flex flex-col sm:flex-row items-center gap-3 pt-2">
        <button
          onClick={() => onPreviewLive(card)}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 py-3.5 font-extrabold text-xs text-slate-200 transition-colors shadow"
        >
          <Eye className="h-4 w-4 text-cyan-400" />
          <span>Preview Live Card</span>
        </button>

        <button
          onClick={() => onSaveAndShare(card)}
          className="w-full sm:flex-1 flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink-500 via-rose-500 to-amber-500 py-3.5 font-extrabold text-xs text-white shadow-xl hover:opacity-95 transition-opacity"
        >
          <Share2 className="h-4 w-4" />
          <span>Generate Share Link & QR</span>
        </button>
      </div>
    </div>
  );
};
