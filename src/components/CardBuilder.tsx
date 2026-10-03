import React, { useState, useEffect } from 'react';
import { CardData, ThemeId, MusicTrack } from '../types/card';
import { FOR_HER_CARD } from '../utils/cardShare';
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
  Sparkles,
  Gamepad2,
  Heart,
} from 'lucide-react';

interface CardBuilderProps {
  initialCard: CardData;
  onSaveAndShare: (card: CardData) => void;
  onPreviewLive: (card: CardData) => void;
  onLoadPreset: (theme: ThemeId) => void;
  isSaving?: boolean;
}

export const CardBuilder: React.FC<CardBuilderProps> = ({
  initialCard,
  onSaveAndShare,
  onPreviewLive,
  onLoadPreset,
  isSaving = false,
}) => {
  const [card, setCard] = useState<CardData>(initialCard);
  const [activeTab, setActiveTab] = useState<'details' | 'theme' | 'content' | 'treats'>('details');

  // Synchronize when initialCard prop changes
  useEffect(() => {
    setCard(initialCard);
  }, [initialCard]);

  const handleClearToBlank = () => {
    setCard({
      id: card.id || `card-${Date.now()}`,
      recipientName: '',
      senderName: '',
      age: undefined,
      eventDate: '',
      headline: '',
      message: '',
      theme: card.theme || 'arcade',
      musicTrack: card.musicTrack || 'arcade',
      candleCount: 5,
      enableMicBlow: true,
      photos: [],
      memories: [],
      giftBoxMessage: '',
      scratchCardSecret: '',
      balloonMessages: [],
      customBadge: '',
      questTitle: '',
      specialQuote: '',
      createdAt: Date.now(),
    });
  };

  const applyForHerPreset = () => {
    setCard({
      ...FOR_HER_CARD,
      id: card.id || `card-${Date.now()}`,
    });
  };

  // New Memory Input
  const [newMemory, setNewMemory] = useState('');

  // 4 Data points count
  const filledCount = [
    Boolean(card.recipientName?.trim()),
    Boolean(card.senderName?.trim()),
    Boolean(card.age),
    Boolean(card.customBadge?.trim()),
  ].filter(Boolean).length;

  const allSixThemes = [
    {
      id: 'romantic' as ThemeId,
      label: 'Romantic Rose',
      subtitle: 'Velvet Petals & Piano',
      icon: '🌹',
      desc: 'Falling roses, grand piano romance melody & 4 velvet moods',
      badge: 'Popular For Her 👑',
      musicTrack: 'romantic' as MusicTrack,
      swatches: ['#e9829b', '#f3a2b5', '#fff9f9'],
    },
    {
      id: 'arcade' as ThemeId,
      label: 'Retro Arcade',
      subtitle: '8-Bit Quest & CRT',
      icon: '🕹️',
      desc: 'Chiptune synth audio, CRT scanlines overlay & +1UP quests',
      badge: '8-Bit Synth 👾',
      musicTrack: 'arcade' as MusicTrack,
      swatches: ['#facc15', '#34d399', '#020617'],
    },
    {
      id: 'pastel' as ThemeId,
      label: 'Cozy Pastel',
      subtitle: 'Sweet Balloons & Boba',
      icon: '🧁',
      desc: 'Soft pastels, playful balloons, sweet cake & cheerful lofi',
      badge: 'Sweet & Cute 🌸',
      musicTrack: 'lofi' as MusicTrack,
      swatches: ['#f472b6', '#fed7aa', '#ffffff'],
    },
    {
      id: 'cyberpunk' as ThemeId,
      label: 'Cyber Neon',
      subtitle: 'Futuristic HUD & Synth',
      icon: '⚡',
      desc: 'High-tech grid background, cyan glow & darksynth pulse',
      badge: 'Neon Glow ⚡',
      musicTrack: 'party' as MusicTrack,
      swatches: ['#06b6d4', '#ec4899', '#020617'],
    },
    {
      id: 'galaxy' as ThemeId,
      label: 'Galactic Stars',
      subtitle: 'Cosmic Nebula & Starlight',
      icon: '🌌',
      desc: 'Constellations, deep space nebula & ethereal cosmic sound',
      badge: 'Cosmic ✨',
      musicTrack: 'cosmic' as MusicTrack,
      swatches: ['#a855f7', '#6366f1', '#0f172a'],
    },
    {
      id: 'luxury' as ThemeId,
      label: 'Luxury Gold',
      subtitle: 'Champagne & Gold Foil',
      icon: '🥂',
      desc: 'Obsidian black, gold foil borders & celebratory brass track',
      badge: 'VIP Elegance 💎',
      musicTrack: 'party' as MusicTrack,
      swatches: ['#f59e0b', '#fbbf24', '#18181b'],
    },
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
    <div className="w-full max-w-xl mx-auto p-3 sm:p-5 space-y-4">
      {/* "For Her" Quick Apply Action Banner */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-2.5 p-3 sm:p-3.5 rounded-2xl bg-white border-2 border-[#f3a2b5] shadow-md shadow-[#f3a2b5]/15 transition-all">
        <div className="flex items-center gap-2.5">
          <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-[#e9829b] to-[#f3a2b5] text-white text-lg shadow-xs">
            👑
          </span>
          <div className="text-left">
            <div className="flex items-center gap-1.5">
              <span className="text-xs font-black text-slate-900 tracking-tight">"For Her" Celebration Card</span>
              <span className="text-[10px] font-extrabold bg-[#f3a2b5]/25 text-[#e9829b] px-2 py-0.5 rounded-full border border-[#f3a2b5]/60">
                Queen · Romantic
              </span>
            </div>
            <p className="text-[11px] text-slate-500 font-medium">
              Velvet roses theme, romantic melody, queen badge & heartfelt wish
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={applyForHerPreset}
          className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-gradient-to-r from-[#e9829b] to-[#f3a2b5] hover:opacity-90 text-white font-extrabold text-xs shadow-md shadow-[#e9829b]/25 active:scale-95 transition-all"
        >
          <Sparkles className="h-3.5 w-3.5" />
          <span>Apply "For Her"</span>
        </button>
      </div>

      {/* Top Title Banner */}
      <div className="text-center space-y-1">
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
          Craft a Sweet Birthday Card
        </h1>
        <p className="text-xs text-slate-500 font-medium">
          Customize themes, candle blowing, balloon popping, and background music!
        </p>
      </div>

      {/* Navigation Tabs */}
      <div className="flex rounded-2xl bg-[#f3a2b5]/25 p-1.5 border border-[#f3a2b5]/40 text-xs font-bold gap-1 shadow-xs">
        <button
          onClick={() => setActiveTab('details')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
            activeTab === 'details'
              ? 'bg-white text-[#e9829b] shadow-sm border border-[#f3a2b5]/50'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <User className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">1. People</span>
          <span className="sm:hidden">People</span>
        </button>

        <button
          onClick={() => setActiveTab('theme')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
            activeTab === 'theme'
              ? 'bg-white text-[#e9829b] shadow-sm border border-[#f3a2b5]/50'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Palette className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">2. Theme</span>
          <span className="sm:hidden">Theme</span>
        </button>

        <button
          onClick={() => setActiveTab('content')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
            activeTab === 'content'
              ? 'bg-white text-[#e9829b] shadow-sm border border-[#f3a2b5]/50'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Edit3 className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">3. Message</span>
          <span className="sm:hidden">Msg</span>
        </button>

        <button
          onClick={() => setActiveTab('treats')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl transition-all ${
            activeTab === 'treats'
              ? 'bg-white text-[#e9829b] shadow-sm border border-[#f3a2b5]/50'
              : 'text-slate-700 hover:text-slate-900 hover:bg-white/40'
          }`}
        >
          <Gift className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">4. Treats</span>
          <span className="sm:hidden">Treats</span>
        </button>

        {/* Easy Direct View Action */}
        <button
          type="button"
          onClick={() => onPreviewLive(card)}
          className="flex items-center justify-center gap-1.5 py-2.5 px-3.5 rounded-xl bg-gradient-to-r from-[#e9829b] to-[#f3a2b5] hover:opacity-95 text-white transition-all font-extrabold shadow-sm active:scale-95"
          title="Easy View: Open Full Live Card Preview"
        >
          <Eye className="h-3.5 w-3.5 text-white" />
          <span>View</span>
        </button>
      </div>

      {/* TAB 1: RECIPIENT & DETAILS - 4 DATA INPUTS IN 4-LINE LIST */}
      {activeTab === 'details' && (
        <div className="p-5 rounded-3xl bg-white border-2 border-[#f3a2b5]/35 space-y-4 backdrop-blur-md shadow-xl shadow-[#f3a2b5]/10">
          <div className="pb-2.5 border-b border-[#f3a2b5]/30 text-xs font-bold text-slate-800 flex items-center gap-1.5">
            <span>📋</span>
            <span>4 Data Fields (List Format):</span>
          </div>

          <div className="space-y-3">
            {/* Line 1 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f3a2b5]/25 text-[#e9829b] text-[10px] font-bold">1</span>
                <span>Line 1: Recipient's Name *</span>
              </label>
              <input
                type="text"
                value={card.recipientName}
                onChange={(e) => updateCardField('recipientName', e.target.value)}
                placeholder="e.g. Sarah, Alex, Mom"
                className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Line 2 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f3a2b5]/25 text-[#e9829b] text-[10px] font-bold">2</span>
                <span>Line 2: Your Name (Sender) *</span>
              </label>
              <input
                type="text"
                value={card.senderName}
                onChange={(e) => updateCardField('senderName', e.target.value)}
                placeholder="e.g. Leo & Friends"
                className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Line 3 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f3a2b5]/25 text-[#e9829b] text-[10px] font-bold">3</span>
                <span>Line 3: Age Turning (Optional)</span>
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
                className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none shadow-2xs"
              />
            </div>

            {/* Line 4 */}
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-[#f3a2b5]/25 text-[#e9829b] text-[10px] font-bold">4</span>
                <span>Line 4: Custom Honorific / Badge</span>
              </label>
              <input
                type="text"
                value={card.customBadge || ''}
                onChange={(e) => updateCardField('customBadge', e.target.value)}
                placeholder="e.g. BIRTHDAY QUEEN, PRINCESS, VIP"
                className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] px-3.5 py-2.5 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none shadow-2xs"
              />

              {/* Quick Badge Chips for Her */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                <span className="text-[10px] font-bold text-slate-500 self-center mr-1">Quick Select:</span>
                {[
                  'BIRTHDAY QUEEN 👑',
                  'GORGEOUS PRINCESS 💖',
                  'SWEETEST SOUL 🌸',
                  'FOREVER BESTIE ✨',
                  'MY EVERYTHING 🌹',
                ].map((badgeText) => (
                  <button
                    key={badgeText}
                    type="button"
                    onClick={() => updateCardField('customBadge', badgeText)}
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-lg border transition-all ${
                      card.customBadge === badgeText
                        ? 'bg-[#e9829b] text-white border-[#e9829b] shadow-xs'
                        : 'bg-white border-[#f3a2b5]/50 text-slate-700 hover:border-[#e9829b] hover:text-[#e9829b]'
                    }`}
                  >
                    {badgeText}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: THEMES & MUSIC */}
      {activeTab === 'theme' && (
        <div className="p-5 rounded-3xl bg-white border-2 border-[#f3a2b5]/35 space-y-6 backdrop-blur-md shadow-xl shadow-[#f3a2b5]/10">
          {/* ALL 6 THEMES IN CLEAN UNIFIED VIEW */}
          <div>
            <div className="flex items-center justify-between mb-3.5">
              <label className="text-xs font-black uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
                <Sparkles className="h-4 w-4 text-[#e9829b]" />
                <span>All 6 Visual Themes (Clean Selection)</span>
              </label>
              <span className="text-[10px] text-[#e9829b] font-bold bg-[#f3a2b5]/20 px-2.5 py-0.5 rounded-full border border-[#f3a2b5]/60">
                6 Themes Available
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {allSixThemes.map((th) => {
                const isSelected = card.theme === th.id;
                return (
                  <button
                    key={th.id}
                    type="button"
                    onClick={() => {
                      updateCardField('theme', th.id);
                      updateCardField('musicTrack', th.musicTrack);
                    }}
                    className={`group relative flex flex-col p-3.5 rounded-2xl border text-left transition-all cursor-pointer ${
                      isSelected
                        ? 'border-2 border-[#e9829b] bg-white ring-2 ring-[#f3a2b5]/40 shadow-md shadow-[#f3a2b5]/25 scale-[1.02]'
                        : 'border-[#f3a2b5]/35 bg-[#fff9f9]/70 hover:border-[#f3a2b5] hover:bg-white hover:shadow-xs'
                    }`}
                  >
                    {/* Top Row: Icon & Status Badge */}
                    <div className="flex items-start justify-between mb-2">
                      <span className="text-2xl filter drop-shadow-xs">{th.icon}</span>
                      {isSelected ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-[#e9829b] to-[#f3a2b5] px-2 py-0.5 text-[9px] font-black text-white shadow-2xs">
                          <Check className="h-2.5 w-2.5" /> Selected
                        </span>
                      ) : (
                        <span className="text-[9px] font-semibold text-slate-400 group-hover:text-[#e9829b] transition-colors">
                          Select
                        </span>
                      )}
                    </div>

                    {/* Title & Subtitle */}
                    <div className="mb-1.5">
                      <h4 className="text-xs font-black text-slate-900 group-hover:text-[#e9829b] transition-colors">
                        {th.label}
                      </h4>
                      <p className="text-[10px] text-slate-500 font-medium leading-tight">
                        {th.subtitle}
                      </p>
                    </div>

                    {/* Theme Description */}
                    <p className="text-[9px] text-slate-400 leading-normal mb-3 line-clamp-2">
                      {th.desc}
                    </p>

                    {/* Bottom Metadata: Feature Badge & Palette Swatches */}
                    <div className="mt-auto pt-2 border-t border-[#f3a2b5]/30 flex items-center justify-between">
                      <span className="text-[9px] font-bold text-[#e9829b] bg-[#f3a2b5]/15 px-1.5 py-0.5 rounded-md">
                        {th.badge}
                      </span>
                      <div className="flex items-center gap-1">
                        {th.swatches.map((color, idx) => (
                          <span
                            key={idx}
                            className="h-2.5 w-2.5 rounded-full border border-slate-300 shadow-2xs"
                            style={{ backgroundColor: color }}
                            title={color}
                          />
                        ))}
                      </div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* AUDIO TRACK SELECTOR */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Music className="h-4 w-4 text-[#e9829b]" />
              <span>Background Synthesizer Audio Track</span>
            </label>
            <div className="space-y-1.5">
              {musicTracks.map((m) => (
                <button
                  key={m.id}
                  type="button"
                  onClick={() => updateCardField('musicTrack', m.id)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs font-medium transition-colors ${
                    card.musicTrack === m.id
                      ? 'bg-[#f3a2b5]/20 border border-[#e9829b] text-[#e9829b] font-bold shadow-xs'
                      : 'bg-[#fff9f9] border border-[#f3a2b5]/30 text-slate-700 hover:bg-white'
                  }`}
                >
                  <span>{m.label}</span>
                  {card.musicTrack === m.id && <Check className="h-4 w-4 text-[#e9829b]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: MESSAGE & CONTENT */}
      {activeTab === 'content' && (
        <div className="p-5 rounded-3xl bg-white border-2 border-[#f3a2b5]/35 space-y-4 backdrop-blur-md shadow-xl shadow-[#f3a2b5]/10">
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Card Headline / Main Title
            </label>
            <input
              type="text"
              value={card.headline}
              onChange={(e) => updateCardField('headline', e.target.value)}
              placeholder="e.g. LEVEL UP! Alex is now Level 25"
              className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none font-bold shadow-2xs"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Main Birthday Wish Message
            </label>
            <textarea
              rows={4}
              value={card.message}
              onChange={(e) => updateCardField('message', e.target.value)}
              placeholder="Write your sweet, funny, or poetic birthday message..."
              className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] p-3 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none leading-relaxed shadow-2xs"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Sub-Title / Quest Title
              </label>
              <input
                type="text"
                value={card.questTitle || ''}
                onChange={(e) => updateCardField('questTitle', e.target.value)}
                placeholder="e.g. Quest: Cake Annihilation"
                className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none shadow-2xs"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Special Birthday Quote
              </label>
              <input
                type="text"
                value={card.specialQuote || ''}
                onChange={(e) => updateCardField('specialQuote', e.target.value)}
                placeholder="e.g. High Score Achieved!"
                className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none shadow-2xs"
              />
            </div>
          </div>

          {/* Memories List */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Shared Memories & Inside Jokes
            </label>
            <div className="flex gap-2 mb-2">
              <input
                type="text"
                value={newMemory}
                onChange={(e) => setNewMemory(e.target.value)}
                placeholder="Add a memory (e.g. 3 AM LAN party)"
                className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none shadow-2xs"
              />
              <button
                onClick={addMemory}
                className="flex items-center gap-1 rounded-xl bg-gradient-to-r from-[#e9829b] to-[#f3a2b5] px-3.5 py-2 text-xs font-bold text-white hover:opacity-90 shadow-xs"
              >
                <Plus className="h-4 w-4" />
                <span>Add</span>
              </button>
            </div>

            <div className="space-y-1.5">
              {(card.memories || []).map((mem, idx) => (
                <div
                  key={idx}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-[#fff9f9] border border-[#f3a2b5]/30 text-xs text-slate-800 shadow-2xs"
                >
                  <span>• {mem}</span>
                  <button
                    onClick={() => removeMemory(idx)}
                    className="text-slate-400 hover:text-rose-600 p-1"
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
        <div className="p-5 rounded-3xl bg-white border-2 border-[#f3a2b5]/35 space-y-5 backdrop-blur-md shadow-xl shadow-[#f3a2b5]/10">
          {/* Cake Candles */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2 flex items-center gap-1.5">
              <Flame className="h-4 w-4 text-amber-500" />
              <span>Candles on Birthday Cake (1 to 10)</span>
            </label>
            <div className="flex items-center gap-4">
              <input
                type="range"
                min={1}
                max={10}
                value={card.candleCount}
                onChange={(e) => updateCardField('candleCount', parseInt(e.target.value))}
                className="w-full accent-[#e9829b] cursor-pointer"
              />
              <span className="font-extrabold text-sm text-[#e9829b] w-8">
                {card.candleCount}
              </span>
            </div>

            <label className="mt-3 flex items-center gap-2 text-xs text-slate-700 cursor-pointer font-medium">
              <input
                type="checkbox"
                checked={card.enableMicBlow}
                onChange={(e) => updateCardField('enableMicBlow', e.target.checked)}
                className="rounded border-[#f3a2b5] text-[#e9829b] focus:ring-[#e9829b]"
              />
              <span>Allow blowing into microphone to extinguish candles 🎙️</span>
            </label>
          </div>

          {/* Gift Box Surprise */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              🎁 Surprise Message inside Unboxing Present
            </label>
            <input
              type="text"
              value={card.giftBoxMessage}
              onChange={(e) => updateCardField('giftBoxMessage', e.target.value)}
              placeholder="e.g. 🎁 1x Unlimited Pizza Pass & Movie Night!"
              className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Scratch Card Secret */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              ✨ Scratch Card Fortune Secret Voucher
            </label>
            <input
              type="text"
              value={card.scratchCardSecret}
              onChange={(e) => updateCardField('scratchCardSecret', e.target.value)}
              placeholder="e.g. 🎟️ Free Coffee & Homemade Cake on Me!"
              className="w-full rounded-xl border border-[#f3a2b5]/40 bg-[#fff9f9] px-3 py-2 text-xs text-slate-900 placeholder-slate-400 focus:border-[#e9829b] focus:ring-2 focus:ring-[#f3a2b5]/30 focus:outline-none shadow-2xs"
            />
          </div>

          {/* Photos Upload */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1">
              Upload Memory Photo (Optional)
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={handlePhotoUpload}
              className="block w-full text-xs text-slate-600 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-gradient-to-r file:from-[#e9829b] file:to-[#f3a2b5] file:text-white hover:file:opacity-90 cursor-pointer"
            />

            {(card.photos || []).length > 0 && (
              <div className="flex gap-2 mt-2">
                {card.photos.map((p, i) => (
                  <div key={i} className="relative h-16 w-16 rounded-xl overflow-hidden border border-[#f3a2b5]/40 shadow-xs">
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
    </div>
  );
};
