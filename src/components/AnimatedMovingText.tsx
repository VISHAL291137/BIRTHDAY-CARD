import React from 'react';

interface AnimatedMovingTextProps {
  text: string;
  className?: string;
  tag?: 'h1' | 'h2' | 'p';
}

export const AnimatedMovingText: React.FC<AnimatedMovingTextProps> = ({
  text,
  className = '',
  tag = 'h1',
}) => {
  const words = text.split(' ');

  const content = (
    <>
      {words.map((word, i) => (
        <span
          key={i}
          className="inline-block transition-transform duration-300 hover:scale-110 mr-1.5 animate-card-step"
          style={{ animationDelay: `${i * 0.08}s` }}
        >
          {word}
        </span>
      ))}
    </>
  );

  if (tag === 'h2') {
    return <h2 className={className}>{content}</h2>;
  }
  if (tag === 'p') {
    return <p className={className}>{content}</p>;
  }
  return <h1 className={className}>{content}</h1>;
};
