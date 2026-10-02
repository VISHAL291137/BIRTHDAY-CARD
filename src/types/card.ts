export type ThemeId =
  | 'arcade'
  | 'romantic'
  | 'cyberpunk'
  | 'galaxy'
  | 'pastel'
  | 'luxury';

export type MusicTrack =
  | 'arcade'
  | 'romantic'
  | 'party'
  | 'lofi'
  | 'cosmic'
  | 'none';

export interface CardData {
  id: string;
  recipientName: string;
  senderName: string;
  age?: number;
  eventDate?: string;
  headline: string;
  message: string;
  theme: ThemeId;
  musicTrack: MusicTrack;
  candleCount: number;
  enableMicBlow: boolean;
  photos: string[]; // Base64 or preset image URLs
  memories: string[]; // Key memories or bullet points
  giftBoxMessage: string; // Message inside present unboxing
  scratchCardSecret: string; // Secret coupon / birthday prophecy
  balloonMessages: string[]; // Secret mini-wishes inside balloons
  customBadge?: string; // e.g., "PLAYER 1", "BIRTHDAY QUEEN", "CHAMPION"
  questTitle?: string;
  specialQuote?: string;
  createdAt: number;
}

export interface PresetAvatar {
  id: string;
  name: string;
  url: string;
  category: 'cute' | 'gaming' | 'party' | 'royal';
}
