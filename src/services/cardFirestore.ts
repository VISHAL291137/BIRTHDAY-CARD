import {
  collection,
  doc,
  setDoc,
  getDoc,
  onSnapshot,
  query,
  limit,
  getDocs,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from '../firebase';
import { CardData } from '../types/card';

const COLLECTION_NAME = 'cards';

export async function saveCardToFirestore(card: CardData): Promise<string> {
  const cardId = card.id || `card-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`;
  const docRef = doc(db, COLLECTION_NAME, cardId);

  // Clean data to match schema & prevent undefined values
  const payload = {
    id: cardId,
    recipientName: card.recipientName || 'Birthday Friend',
    senderName: card.senderName || 'Anonymous',
    headline: card.headline || 'Happy Birthday! 🎉',
    message: card.message || 'Wishing you the best birthday ever!',
    theme: card.theme || 'arcade',
    musicTrack: card.musicTrack || 'arcade',
    candleCount: Number(card.candleCount) || 5,
    enableMicBlow: Boolean(card.enableMicBlow),
    giftBoxMessage: card.giftBoxMessage || '',
    scratchCardSecret: card.scratchCardSecret || '',
    questTitle: card.questTitle || '',
    specialQuote: card.specialQuote || '',
    customBadge: card.customBadge || '',
    balloonMessages: card.balloonMessages || [],
    memories: card.memories || [],
    photos: card.photos || [],
    createdAt: new Date().toISOString(),
  };

  try {
    await setDoc(docRef, payload);
    return cardId;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, `${COLLECTION_NAME}/${cardId}`);
  }
}

export async function getCardFromFirestore(cardId: string): Promise<CardData | null> {
  const path = `${COLLECTION_NAME}/${cardId}`;
  try {
    const docRef = doc(db, COLLECTION_NAME, cardId);
    const snap = await getDoc(docRef);
    if (!snap.exists()) return null;
    return snap.data() as CardData;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeToCard(
  cardId: string,
  onUpdate: (card: CardData) => void,
  onError?: (err: Error) => void
): () => void {
  const path = `${COLLECTION_NAME}/${cardId}`;
  const docRef = doc(db, COLLECTION_NAME, cardId);

  return onSnapshot(
    docRef,
    (snap) => {
      if (snap.exists()) {
        onUpdate(snap.data() as CardData);
      }
    },
    (error) => {
      if (onError) onError(error);
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

export async function listRecentCardsFromFirestore(): Promise<CardData[]> {
  const path = COLLECTION_NAME;
  try {
    const q = query(collection(db, COLLECTION_NAME), limit(12));
    const snap = await getDocs(q);
    const results: CardData[] = [];
    snap.forEach((d) => {
      results.push(d.data() as CardData);
    });
    return results;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
