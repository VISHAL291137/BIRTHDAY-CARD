import { CardData, ThemeId } from '../types/card';

/**
 * Encodes CardData object into a URL-safe Base64 string
 */
export function encodeCardToUrl(card: CardData): string {
  try {
    const jsonStr = JSON.stringify(card);
    // Standard Base64 encode + make URL safe
    const base64 = btoa(encodeURIComponent(jsonStr));
    return base64;
  } catch (err) {
    console.error('Failed to encode card:', err);
    return '';
  }
}

/**
 * Decodes URL-safe Base64 string back to CardData object
 */
export function decodeCardFromUrl(encoded: string): CardData | null {
  try {
    const decodedJson = decodeURIComponent(atob(encoded));
    const card = JSON.parse(decodedJson) as CardData;
    return card;
  } catch (err) {
    console.error('Failed to decode card:', err);
    return null;
  }
}

/**
 * Sample Preset Cards for quick demonstration
 */
export const SAMPLE_PRESET_CARDS: Record<ThemeId, CardData> = {
  arcade: {
    id: 'sample-arcade-1',
    recipientName: 'Alex',
    senderName: 'Sam & The Guild',
    age: 25,
    eventDate: '2026-10-15',
    headline: 'LEVEL UP! 🎮 ALEX IS NOW LEVEL 25',
    message: 'Congratulations on completing another 365-day rotation around the sun! You have unlocked new achievements, mastered high-score strategies, and conquered the legendary Boss Battle of your mid-twenties. May your health bar remain full, your coffee stay hot, and your loot drops be legendary!',
    theme: 'arcade',
    musicTrack: 'arcade',
    candleCount: 5,
    enableMicBlow: true,
    photos: [],
    memories: [
      'Cleared the 3:00 AM LAN Party Boss together',
      'Discovered the secret pizza place in 2024',
      'Never lost a game of Mario Kart'
    ],
    giftBoxMessage: '🎁 REWARD UNLOCKED: 1x Unlimited Pizza Pass & 1000 Guild XP!',
    scratchCardSecret: '🎟️ SPECIAL VOUCHER: Free Coffee & Gaming Marathon Night on Me!',
    balloonMessages: [
      '⚡ +100 Wisdom Stats!',
      '🍕 Infinite Pizza Luck!',
      '🎮 Flawless Victory!',
      '⭐ Legendary Friend Status!'
    ],
    customBadge: 'PLAYER 1',
    questTitle: 'QUEST: CAKE ANNIHILATION',
    specialQuote: 'Level 25 unlocked: High Score achieved!',
    createdAt: Date.now(),
  },
  romantic: {
    id: 'sample-romantic-1',
    recipientName: 'Sarah',
    senderName: 'Leo',
    age: 24,
    eventDate: '2026-10-20',
    headline: 'Happy Birthday to My Favorite Star ✨',
    message: 'To the one who brings warmth to every quiet room and magic to every ordinary day. Wishing you a birthday as soft, brilliant, and breathtaking as you are. May this year shower you with endless laughter, gentle adventures, and all the quiet joy your heart can hold.',
    theme: 'romantic',
    musicTrack: 'romantic',
    candleCount: 3,
    enableMicBlow: true,
    photos: [],
    memories: [
      'Our rainy afternoon coffee date in Paris',
      'Stargazing until 2 AM on the beach',
      'Making homemade pasta and messing up the flour'
    ],
    giftBoxMessage: '🌹 Inside this box: A ticket to our next weekend getaway together!',
    scratchCardSecret: '💖 ROMANTIC COUPON: 1x Breakfast in Bed & Picnic under the Stars',
    balloonMessages: [
      '🌸 You make life sweeter!',
      '✨ Endless happiness ahead!',
      '💌 Loved beyond words!',
      '🥂 Here is to forever memories!'
    ],
    customBadge: 'MY EVERYTHING',
    questTitle: 'A Breathtaking Journey',
    specialQuote: 'In all the world, there is no heart for me like yours.',
    createdAt: Date.now(),
  },
  cyberpunk: {
    id: 'sample-cyber-1',
    recipientName: 'Kael',
    senderName: 'CyberOps Network',
    age: 28,
    eventDate: '2026-10-10',
    headline: 'CYBER-YEAR 28 // SYSTEM ONLINE ⚡',
    message: 'System audit complete: Core processors running at 100% capacity. Protocol #28 activated. You continue to breach boundaries, hack impossible challenges, and upgrade everyone around you. Keep blazing your path through the digital neon landscape.',
    theme: 'cyberpunk',
    musicTrack: 'party',
    candleCount: 4,
    enableMicBlow: true,
    photos: [],
    memories: [
      'Building the night-city tech prototype',
      'Late night synthwave playlist sessions',
      'Hacking the midnight hackathon'
    ],
    giftBoxMessage: '⚡ CYBER-DROP: Neural Upgrade + VIP Access to Neon Lounge',
    scratchCardSecret: '🔑 DECRYPTED ACCESS: Secret Rooftop Party Pass',
    balloonMessages: [
      '⚡ Quantum Boost!',
      '💾 100% Battery Active!',
      '🌃 Neon Lights Forever!',
      '🛸 Elite Operative!'
    ],
    customBadge: 'CYBER OPERATIVE',
    questTitle: 'OVERDRIVE MODE',
    specialQuote: 'Future looks bright in neon cyan.',
    createdAt: Date.now(),
  },
  galaxy: {
    id: 'sample-galaxy-1',
    recipientName: 'Nova',
    senderName: 'Orion',
    age: 22,
    eventDate: '2026-11-01',
    headline: 'To the Brightest Galaxy in the Cosmos 🌌',
    message: 'Another celestial orbit completed! You shine brighter than a supernova and light up every constellation around you. Keep dreaming big among the stars, exploring new galaxies, and spreading your cosmic magic wherever you orbit.',
    theme: 'galaxy',
    musicTrack: 'cosmic',
    candleCount: 3,
    enableMicBlow: true,
    photos: [],
    memories: [
      'Watching the meteor shower at the mountain top',
      'Late night deep space philosophical chats',
      'The cosmic campfire under galactic skies'
    ],
    giftBoxMessage: '🌌 COSMIC GIFT: A real registered star named after you + Telescope night!',
    scratchCardSecret: '✨ CELESTIAL PASS: Midnight Planetarium Tour & Stargazing',
    balloonMessages: [
      '⭐ Cosmic Brilliance!',
      '🚀 Orbiting Success!',
      '🌌 Stellar Energy!',
      '💫 Wishing upon stars!'
    ],
    customBadge: 'COSMIC EXPLORER',
    questTitle: 'CELESTIAL ORBIT',
    specialQuote: 'You are made of stardust and golden wishes.',
    createdAt: Date.now(),
  },
  pastel: {
    id: 'sample-pastel-1',
    recipientName: 'Maya',
    senderName: 'Chloe & Emma',
    age: 21,
    eventDate: '2026-10-05',
    headline: 'Sweetest Birthday Wishes, Maya! 🧁',
    message: 'Happy Birthday to the sunshine of our friend group! Your kindness, warm smile, and infectious giggle make every single day so much brighter. Wishing you a year filled with sweet treats, cozy hugs, cute memories, and endless confetti!',
    theme: 'pastel',
    musicTrack: 'lofi',
    candleCount: 3,
    enableMicBlow: true,
    photos: [],
    memories: [
      'Our Sunday matcha latte dates',
      'Making DIY pottery & laughing at our lopsided cups',
      'The beach sunset picnic with cupcakes'
    ],
    giftBoxMessage: '🧁 SWEET SURPRISE: Unlimited Boba & Dessert Crawl Voucher!',
    scratchCardSecret: '🌸 FRIENDSHIP PASS: Spa Day & Movie Marathon on Us!',
    balloonMessages: [
      '🍰 Pure Sweetness!',
      '🎀 Cozy Vibes Only!',
      '🌸 Sunshine & Sparkles!',
      '🧁 Cupcake Magic!'
    ],
    customBadge: 'SWEET QUEEN',
    questTitle: 'PASTEL PICNIC',
    specialQuote: 'Life is sweet, and so are you!',
    createdAt: Date.now(),
  },
  luxury: {
    id: 'sample-luxury-1',
    recipientName: 'David',
    senderName: 'The Executive Team',
    age: 30,
    eventDate: '2026-10-18',
    headline: 'A Toast to Excellence: Happy Birthday 🥂',
    message: 'Wishing you a distinguished milestone birthday. May this new decade bring unprecedented success, refined achievements, good health, and memorable celebrations with loved ones. Here is to rising higher and enjoying the finest moments in life.',
    theme: 'luxury',
    musicTrack: 'party',
    candleCount: 3,
    enableMicBlow: true,
    photos: [],
    memories: [
      'Celebrating the milestone project launch in 2025',
      'Golf tournament victory weekend',
      'Gourmet tasting dinner celebration'
    ],
    giftBoxMessage: '🍾 VIP RESERVE: A vintage champagne bottle & fine dining experience.',
    scratchCardSecret: '👑 GOLD TICKET: Exclusive Weekend Retreat Pass',
    balloonMessages: [
      '🥂 Cheers to Success!',
      '✨ Golden Milestones!',
      '👑 Royal Standard!',
      '🌟 Excellence Unlocked!'
    ],
    customBadge: 'VIP EDITION',
    questTitle: 'MILESTONE 30',
    specialQuote: 'Elegance is the only beauty that never fades.',
    createdAt: Date.now(),
  },
};

/**
 * Save card to LocalStorage history
 */
export function saveCardToHistory(card: CardData) {
  try {
    const existing = getSavedCardHistory();
    const filtered = existing.filter((c) => c.id !== card.id);
    const updated = [card, ...filtered].slice(0, 15); // Keep last 15
    localStorage.setItem('celebrationcraft_history', JSON.stringify(updated));
  } catch (err) {
    console.error(err);
  }
}

/**
 * Get saved card history from LocalStorage
 */
export function getSavedCardHistory(): CardData[] {
  try {
    const raw = localStorage.getItem('celebrationcraft_history');
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (err) {
    console.error(err);
  }
  return [];
}
