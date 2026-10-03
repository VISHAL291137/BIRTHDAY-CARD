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
  BLANK_CARD,
  FOR_HER_CARD,
  saveCardToHistory,
  getSavedCardHistory,
} from './utils/cardShare';
import {
  saveCardToFirestore,
  getCardFromFirestore,
  subscribeToCard,
  listRecentCardsFromFirestore,
} from './services/cardFirestore';
import { Sparkles, PlusCircle, History, Gift, Heart, Eye, ArrowLeft, CloudCheck, RefreshCw, Share2, Trash2 } from 'lucide-react';

export default function App() {
  const [currentCard, setCurrentCard] = useState<CardData>(FOR_HER_CARD);
  const [viewMode, setViewMode] = useState<'builder' | 'presentation'>('builder');
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  const [historyCards, setHistoryCards] = useState<CardData[]>([]);
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
    setCurrentCard({
      ...BLANK_CARD,
      id: `card-${Date.now()}`,
      createdAt: Date.now(),
    });
    setViewMode('builder');
    setIsLiveSynced(false);
    // Clear URL query
    window.history.pushState({}, '', window.location.pathname);
  };

  return (
    <div
      className="h-screen h-[100dvh] max-h-screen max-h-[100dvh] bg-[#fff9f9] text-slate-800 flex flex-col antialiased selection:bg-[#e9829b] selection:text-white overflow-hidden"
      style={{ backgroundColor: '#fff9f9' }}
    >
      {/* Top Header Bar */}
      <header className="flex-shrink-0 z-40 flex items-center justify-between border-b border-[#f3a2b5]/40 bg-[#fff9f9]/95 px-3 sm:px-4 py-2 sm:py-2.5 backdrop-blur-md shadow-2xs">
        {/* Brand Zone */}
        <div className="flex items-center gap-2">
          {viewMode === 'presentation' && (
            <button
              onClick={() => setViewMode('builder')}
              className="mr-1 rounded-xl bg-white border border-[#f3a2b5]/50 p-1.5 sm:p-2 text-slate-700 hover:text-slate-900 hover:bg-[#fff9f9] transition-colors shadow-2xs"
              title="Back to Card Editor"
            >
              <ArrowLeft className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
          )}

          <a
            href="/"
            onClick={(e) => {
              e.preventDefault();
              handleCreateNew();
            }}
            className="text-sm sm:text-base font-black tracking-tight text-slate-900 flex items-center gap-1.5 sm:gap-2"
          >
            <span className="flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-[#e9829b] to-[#f3a2b5] text-white shadow-md text-sm sm:text-base">
              🎂
            </span>
            <span>CelebrationCraft</span>
          </a>

          {isLiveSynced && (
            <span className="hidden md:inline-flex items-center gap-1 rounded-full bg-[#f3a2b5]/20 px-2 py-0.5 text-[10px] font-bold text-[#e9829b] border border-[#f3a2b5]/50">
              <span className="h-1.5 w-1.5 rounded-full bg-[#e9829b] animate-pulse" />
              <span>Live Firestore Synced</span>
            </span>
          )}
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-1.5 sm:gap-2">
          {viewMode === 'builder' ? (
            <>
              <button
                onClick={() => handlePreviewLive(currentCard)}
                className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-white border border-[#f3a2b5]/50 hover:bg-[#fff9f9] hover:border-[#e9829b] px-2.5 sm:px-3.5 py-1.5 text-xs font-bold text-slate-700 transition-colors shadow-2xs"
              >
                <Eye className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-[#e9829b]" />
                <span>Preview</span>
              </button>

              <button
                onClick={() => handleSaveAndShare(currentCard)}
                disabled={isSaving}
                className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-gradient-to-r from-[#e9829b] via-[#f3a2b5] to-[#e9829b] px-3 sm:px-4 py-1.5 text-xs font-bold text-white transition-opacity shadow-md hover:opacity-95 disabled:opacity-50"
              >
                <Share2 className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">{isSaving ? 'Saving...' : 'Save & Share'}</span>
                <span className="sm:hidden">{isSaving ? '...' : 'Save'}</span>
              </button>
            </>
          ) : (
            <button
              onClick={() => setViewMode('builder')}
              className="flex items-center gap-1 sm:gap-1.5 rounded-xl bg-gradient-to-r from-[#e9829b] to-[#f3a2b5] hover:opacity-90 px-3 sm:px-3.5 py-1.5 text-xs font-bold text-white transition-all shadow"
            >
              <PlusCircle className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
              <span>Edit / New</span>
            </button>
          )}

        </div>
      </header>

      {/* Main Container Area - Responsive 100dvh Fitting */}
      <main className="flex-1 min-h-0 bg-[#fff9f9] overflow-y-auto flex flex-col">
        {isLoadingCard ? (
          <div className="flex-1 flex flex-col items-center justify-center space-y-3">
            <RefreshCw className="h-8 w-8 text-[#e9829b] animate-spin" />
            <p className="text-xs font-bold text-slate-600">Loading Live Card from Firebase...</p>
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

      {/* Footer - Sleek & Compact to Fit One Window */}
      <footer className="flex-shrink-0 border-t border-[#f3a2b5]/30 bg-[#fff9f9] py-1.5 px-3 text-center text-[10px] sm:text-[11px] text-slate-500">
        <p>CelebrationCraft · Interactive Birthday Card Studio · Live Firestore Synced</p>
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
