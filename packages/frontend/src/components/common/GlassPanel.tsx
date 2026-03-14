import type { ReactNode } from 'react';

interface GlassPanelProps {
  children: ReactNode;
  className?: string;
}

/**
 * Reusable frosted glass panel with dark translucent effect.
 */
export default function GlassPanel({ children, className = '' }: GlassPanelProps) {
  return (
    <div className={`glass-panel rounded-widget ${className}`}>
      {children}
    </div>
  );
}
