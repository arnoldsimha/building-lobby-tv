import { useState, useEffect, type ReactNode } from 'react';

interface FadeTransitionProps {
  /** Unique key that triggers the crossfade when changed */
  transitionKey: string | number;
  /** Duration of the fade in milliseconds */
  duration?: number;
  children: ReactNode;
  className?: string;
}

/**
 * Crossfade animation wrapper. When transitionKey changes,
 * the old content fades out and the new content fades in.
 * Uses Tailwind transition-opacity + dynamic duration.
 */
export default function FadeTransition({
  transitionKey,
  duration = 1500,
  children,
  className = '',
}: FadeTransitionProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [currentKey, setCurrentKey] = useState(transitionKey);
  const [displayedChildren, setDisplayedChildren] = useState(children);

  useEffect(() => {
    if (transitionKey !== currentKey) {
      setIsVisible(false);

      const timer = setTimeout(() => {
        setDisplayedChildren(children);
        setCurrentKey(transitionKey);
        setIsVisible(true);
      }, duration / 2);

      return () => clearTimeout(timer);
    } else {
      setDisplayedChildren(children);
    }
  }, [transitionKey, children, currentKey, duration]);

  const halfDuration = duration / 2;

  return (
    <div
      className={`transition-opacity ease-in-out ${isVisible ? 'opacity-100' : 'opacity-0'} ${className}`}
      style={{ transitionDuration: `${halfDuration}ms` }}
    >
      {displayedChildren}
    </div>
  );
}
