import React from 'react';
import { ThemeId } from '../types/card';
import { Sparkles, Heart } from 'lucide-react';

interface MovingWordsMarqueeProps {
  theme?: ThemeId;
  words?: string[];
}

const DEFAULT_THEME_WORDS: Record<ThemeId, string[]> = {
  romantic: [
    'FOREVER CHERISHED',
    'SWEETEST MOMENTS',
    'ENDLESS LOVE',
    'RADIANT SMILE',
    'MAGIC IN THE AIR',
    'HAPPY BIRTHDAY',
    'PURE JOY',
    'MY FAVORITE PERSON',
  ],
  arcade: [
    'LEVEL UP!',
    'MAX SCORE',
    'BOSS CLEARED',
    'LEGENDARY STATUS',
    'QUEST COMPLETED',
    '+1 WISDOM STATS',
    'PLAYER 1 VICTORY',
  ],
  cyberpunk: [
    'NEURAL OVERDRIVE',
    'SYSTEM UPGRADE',
    'CORE ONLINE',
    'NEON CITY',
    'QUANTUM REACH',
    'ELITE OPERATIVE',
  ],
  galaxy: [
    'COSMIC CELEBRATION',
    'SUPERNOVA SHINE',
    'STELLAR ENERGY',
    'ORBITING HAPPINESS',
    'INFINITE STARS',
  ],
  pastel: [
    'SWEET CUPCAKES',
    'BOBA & SMILES',
    'COZY VIBES',
    'PARTY BALLOONS',
    'HAPPY DREAMS',
  ],
  luxury: [
    'A TOAST TO EXCELLENCE',
    'GOLDEN MILESTONE',
    'DISTINGUISHED YEAR',
    'ROYAL CELEBRATION',
  ],
};

export const MovingWordsMarquee: React.FC<MovingWordsMarqueeProps> = ({
  theme = 'romantic',
  words,
}) => {
  const wordList = words || DEFAULT_THEME_WORDS[theme] || DEFAULT_THEME_WORDS.romantic;

  return (
    <div className="relative overflow-hidden py-2 my-2 rounded-xl bg-black/30 border border-pink-500/20 backdrop-blur-sm">
      <div className="animate-marquee-words flex items-center whitespace-nowrap text-xs font-bold tracking-widest text-pink-200/90 uppercase">
        {/* Double list for seamless infinite loop */}
        {[...wordList, ...wordList].map((word, idx) => (
          <span key={idx} className="inline-flex items-center gap-2 mx-4">
            {theme === 'romantic' ? (
              <Heart className="h-3 w-3 text-rose-400 fill-rose-400/40 inline" />
            ) : (
              <Sparkles className="h-3 w-3 text-amber-300 inline" />
            )}
            <span>{word}</span>
          </span>
        ))}
      </div>
    </div>
  );
};
