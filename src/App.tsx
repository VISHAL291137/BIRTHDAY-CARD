/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { CardData, ThemeId } from './types/card';
import { CardBuilder } from './components/CardBuilder';
import { CardPresentation } from './components/CardPresentation';
import { ExportShareModal } from './components/ExportShareModal';
import {
  encodeCardToUrl,
  decodeCardFromUrl,
  SAMPLE_PRESET_CARDS,
  saveCardToHistory,
  getSavedCardHistory,
} from './utils/cardShare';
import {
  saveCardToFirestore,
  getCardFromFirestore,
  subscribeToCard,
  listRecentCardsFromFirestore,
} from './services/cardFirestore';
import { Sparkles, PlusCircle, History, Gift, Heart, Eye, ArrowLeft, CloudCheck, RefreshCw } from 'lucide-react';

export default function App() {
  const [currentCard, setCurrentCard] = useState<CardData>(SAMPLE_PRESET_CARDS.arcade);
  const [viewMode, setViewMode] = useState<'builder' | 'presentation'>('builder');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [historyCards, setHistoryCards] = useState<CardData[]>([]);
  const [showHistoryDrawer, setShowHistoryDrawer] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoadingCard, setIsLoadingCard] = useState(false);
  const [isLiveSynced, setIsLiveSynced] = useState(false);

  // Check URL query string on load
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const firestoreCardId = params.get('id');
    const legacyCardParam = params.get('card');

    if (firestoreCardId) {
      setIsLoadingCard(true);
      // Fetch initial and subscribe for real-time live updates!
      const unsubscribe = subscribeToCard(
        firestoreCardId,
        (liveCard) => {
          setCurrentCard(liveCard);
          setViewMode('presentation');
          setIsLiveSynced(true);
          setIsLoadingCard(false);
          saveCardToHistory(liveCard);
        },
        (err) => {
          console.error('Could not load card from Firestore:', err);
          setIsLoadingCard(false);
        }
      );

      return () => {
        unsubscribe();
      };
    } else if (legacyCardParam) {
      const decoded = decodeCardFromUrl(legacyCardParam);
      if (decoded) {
        setCurrentCard(decoded);
        setViewMode('presentation');
        saveCardToHistory(decoded);
      }
    }

    setHistoryCards(getSavedCardHistory());

    // Also populate recent cards from Firestore
    listRecentCardsFromFirestore()
      .then((remoteCards) => {
        if (remoteCards.length > 0) {
          setHistoryCards((local) => {
            const combined = [...remoteCards, ...local];
            const unique = Array.from(new Map(combined.map((c) => [c.id, c])).values());
            return unique;
          });
        }
      })
      .catch((err) => console.log('Could not load recent Firestore cards:', err));
  }, []);

  const handleSaveAndShare = async (card: CardData) => {
    setIsSaving(true);
    try {
      // 1. Save card to Firebase Firestore cloud database!
      const cardId = await saveCardToFirestore(card);
      const origin = window.location.origin + window.location.pathname;
      const cleanLiveUrl = `${origin}?id=${cardId}`;

      const savedCard = { ...card, id: cardId };
      setCurrentCard(savedCard);
      setShareUrl(cleanLiveUrl);
      saveCardToHistory(savedCard);
      setHistoryCards(getSavedCardHistory());
      setIsLiveSynced(true);
      setIsShareModalOpen(true);
    } catch (error) {
      console.error('Firestore save error, falling back to URL encoding:', error);
      // Fallback
      const encoded = encodeCardToUrl(card);
      const origin = window.location.origin + window.location.pathname;
      setShareUrl(`${origin}?card=${encoded}`);
      setIsShareModalOpen(true);
    } finally {
      setIsSaving(false);
    }
  };

  const handlePreviewLive = (card: CardData) => {
    setCurrentCard(card);
    setViewMode('presentation');
  };

  const handleLoadPreset = (theme: ThemeId) => {
    const preset = SAMPLE_PRESET_CARDS[theme] || SAMPLE_PRESET_CARDS.arcade;
    const newCard: CardData = {
      ...preset,
      id: `card-${Date.now()}`,
      createdAt: Date.now(),
    };
    setCurrentCard(newCard);
    setIsLiveSynced(false);
  };

  const handleCreateNew = () => {
    const blankCard: CardData = {
      id: `card-${Date.now()}`,
      recipientName: '',
      senderName: '',
      headline: 'Happy Birthday! 🎉',
      message: 'Wishing you a day filled with joy, laughter, and sweet surprises!',
      theme: 'arcade',
      musicTrack: 'arcade',
      candleCount: 5,
      enableMicBlow: true,
      photos: [],
      memories: [],
      giftBoxMessage: '🎁 SPECIAL SURPRISE: A day of celebration and your favorite treat on me!',
      scratchCardSecret: '🎟️ SECRET VOUCHER: 1x Homemade Dinner + Unlimited Desserts!',
      balloonMessages: [
        '🎉 Wishing you infinite joy!',
        '🎂 May all your dreams come true!',
        '⭐ Level Up +1 Year!',
        '🍕 Unlimited Pizza Luck!'
      ],
      createdAt: Date.now(),
    };
    setCurrentCard(blankCard);
    setViewMode('builder');
    setIsLiveSynced(false);
    // Clear URL query
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col antialiased selection:bg-pink-500 selection:text-white">
      {/* Top Header Bar */}
      <header className="sticky top-0 z-40 flex items-center justify-between border-b border-slate-800 bg-slate-950/80 px-4 py-3 backdrop-blur-md">
        {/* Brand Zone */}
        <div className="flex items-center gap-2">
          {viewMode === 'presentation' && (
            <button
              onClick={() => setViewMode('builder')}
              className="mr-1 rounded-xl bg-slate-900 border border-slate-800 p-2 text-slate-300 hover:text-white hover:bg-slate-800 transition-colors"
              title="Back to Card Editor"
            >
              <ArrowLeft className="h-4 w-4" />
            </button>
          )}

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleCreateNew();
            }}
            className="text-base font-extrabold tracking-tight text-white flex items-center gap-2"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-pink-500 to-amber-400 text-white shadow-md">
              🎂
            </span>
            <span>CelebrationCraft</span>
          </a>

          {isLiveSynced && (
            <span className="hidden sm:inline-flex items-center gap-1 rounded-full bg-emerald-500/20 px-2.5 py-0.5 text-[10px] font-bold text-emerald-300 border border-emerald-500/30">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live Firestore Synced</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2">
          {viewMode === 'builder' ? (
            <button
              onClick={() => handlePreviewLive(currentCard)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-200 transition-colors"
            >
              <Eye className="h-4 w-4 text-cyan-400" />
              <span>Preview</span>
            </button>
          ) : (
            <button
              onClick={() => setViewMode('builder')}
              className="flex items-center gap-1.5 rounded-xl bg-pink-600 hover:bg-pink-500 px-3 py-1.5 text-xs font-bold text-white transition-colors shadow"
            >
              <PlusCircle className="h-4 w-4" />
              <span>Edit / New</span>
            </button>
          )}

          {historyCards.length > 0 && (
            <button
              onClick={() => setShowHistoryDrawer(!showHistoryDrawer)}
              className="flex items-center gap-1.5 rounded-xl bg-slate-900 border border-slate-800 hover:bg-slate-800 px-3 py-1.5 text-xs font-bold text-slate-300 transition-colors"
              title="Recent Cards History"
            >
              <History className="h-4 w-4 text-amber-400" />
              <span className="hidden sm:inline">Saved Cards ({historyCards.length})</span>
            </button>
          )}
        </div>
      </header>

      {/* History Cards Slide-Down Panel */}
      {showHistoryDrawer && (
        <div className="bg-slate-900 border-b border-slate-800 p-4 animate-fade-in">
          <div className="mx-auto max-w-xl">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-400 mb-2 flex items-center gap-1">
              <History className="h-3.5 w-3.5 text-amber-400" />
              <span>Saved Firestore Cloud & Local Cards</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-48 overflow-y-auto">
              {historyCards.map((c) => (
                <button
                  key={c.id}
                  onClick={() => {
                    setCurrentCard(c);
                    setViewMode('presentation');
                    setShowHistoryDrawer(false);
                  }}
                  className="flex items-center justify-between p-2.5 rounded-xl bg-slate-950 border border-slate-800 hover:border-pink-500 text-left transition-colors"
                >
                  <div>
                    <span className="block text-xs font-bold text-white truncate">
                      {c.recipientName ? `Card for ${c.recipientName}` : c.headline}
                    </span>
                    <span className="text-[10px] text-slate-400">
                      Theme: {c.theme} · From {c.senderName || 'Anon'}
                    </span>
                  </div>
                  <span className="text-xs">➡️</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Main Container Area */}
      <main className="flex-1">
        {isLoadingCard ? (
          <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="h-8 w-8 text-pink-500 animate-spin" />
            <p className="text-xs font-bold text-slate-400">Loading Live Card from Firebase...</p>
          </div>
        ) : viewMode === 'builder' ? (
          <CardBuilder
            initialCard={currentCard}
            onSaveAndShare={handleSaveAndShare}
            onPreviewLive={handlePreviewLive}
            onLoadPreset={handleLoadPreset}
            isSaving={isSaving}
          />
        ) : (
          <CardPresentation
            card={currentCard}
            onEditOrCreateOwn={() => setViewMode('builder')}
            onOpenShareModal={() => {
              const origin = window.location.origin + window.location.pathname;
              const link = currentCard.id ? `${origin}?id=${currentCard.id}` : `${origin}?card=${encodeCardToUrl(currentCard)}`;
              setShareUrl(link);
              setIsShareModalOpen(true);
            }}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-900 bg-slate-950 p-4 text-center text-xs text-slate-500">
        <p>CelebrationCraft · Interactive Birthday Card Studio & Generator · Firebase Firestore Connected</p>
      </footer>

      {/* Export & Share Modal */}
      <ExportShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        shareUrl={shareUrl}
        recipientName={currentCard.recipientName}
      />
    </div>
  );
}
