import type { ReactNode } from 'react';

interface WidgetBoxProps {
  icon: string;
  title: string;
  children: ReactNode;
  className?: string;
  contentClassName?: string;
}

/**
 * Premium widget container with frosted glass effect.
 * Features a gradient title bar + translucent content area.
 * Designed for big-screen lobby display.
 */
export default function WidgetBox({
  icon,
  title,
  children,
  className = '',
  contentClassName = '',
}: WidgetBoxProps) {
  return (
    <div
      className={`glass-panel rounded-widget overflow-hidden shadow-widget ${className}`}
    >
      {/* Gradient title bar */}
      <div className="widget-header-gradient text-white px-5 py-2.5 flex items-center gap-2.5 text-widget-title min-h-[44px] tracking-wide">
        <span className="text-lg opacity-90">{icon}</span>
        <span className="font-bold uppercase tracking-wider">{title}</span>
      </div>
      {/* Content area */}
      <div className={`p-5 text-white/90 text-widget-content ${contentClassName}`}>
        {children}
      </div>
    </div>
  );
}
