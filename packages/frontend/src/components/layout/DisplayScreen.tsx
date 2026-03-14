import { Component, type ReactNode, type ErrorInfo } from 'react';
import WallpaperLayer from './WallpaperLayer';
import TopBar from './TopBar';
import LeftPanel from './LeftPanel';
import CenterPanel from './CenterPanel';
import RightPanel from './RightPanel';
import BottomTicker from './BottomTicker';
import MusicPlayer from '../widgets/MusicPlayer';

/* ===== Per-Widget Error Boundary ===== */
interface ErrorBoundaryProps {
  name: string;
  children: ReactNode;
}

interface ErrorBoundaryState {
  hasError: boolean;
  error: Error | null;
}

class WidgetErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error(`[ErrorBoundary:${this.props.name}]`, error.message);
    console.error(`[ErrorBoundary:${this.props.name}] Stack:`, errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-panel border-red-400/30 text-white p-3 rounded-widget text-base">
          <strong>❌ {this.props.name}</strong>
          <p className="mt-1 text-sm text-white/60">{this.state.error?.message}</p>
        </div>
      );
    }
    return this.props.children;
  }
}

/**
 * Main display screen — premium lobby TV layout.
 *
 * 3-Column Layout (RTL flex):
 * ┌──────────────────────────────────────────────┐
 * │       TopBar: Building Header (dark glass)    │
 * ├────────────┬──────────────────┬──────────────┤
 * │ Left Panel │   Center Panel   │ Right Panel  │
 * │ Clock      │   Pictures       │ Messages     │
 * │ Shabbat    │   (large)        │              │
 * ├────────────┴──────────────────┴──────────────┤
 * │       BottomTicker: News (dark glass)         │
 * └──────────────────────────────────────────────┘
 */
export default function DisplayScreen() {
  return (
    <div
      dir="rtl"
      className="relative w-screen h-screen overflow-hidden font-heebo bg-black"
    >
      {/* Layer 0: Wallpaper Background */}
      <div className="absolute inset-0 z-0">
        <WidgetErrorBoundary name="WallpaperLayer">
          <WallpaperLayer />
        </WidgetErrorBoundary>
      </div>

      {/* Layer 1: Content */}
      <div className="relative z-10 w-full h-full flex flex-col">
        {/* Row 1: Top Bar — full-width dark glass header */}
        <div className="shrink-0 mb-4">
          <WidgetErrorBoundary name="TopBar">
            <TopBar />
          </WidgetErrorBoundary>
        </div>

        {/* Row 2: 3-Column middle area */}
        <div className="flex-1 flex px-6 gap-5 overflow-hidden min-h-0">
          {/* 1st in DOM → visually RIGHT in RTL — Messages */}
          <div className="w-[28%] shrink-0 flex flex-col gap-4 overflow-y-auto">
            <WidgetErrorBoundary name="RightPanel">
              <RightPanel />
            </WidgetErrorBoundary>
          </div>

          {/* Center column — Pictures (large) */}
          <div className="flex-1 min-w-0 flex flex-col overflow-hidden">
            <WidgetErrorBoundary name="CenterPanel">
              <CenterPanel />
            </WidgetErrorBoundary>
          </div>

          {/* 3rd in DOM → visually LEFT in RTL — Clock + Shabbat */}
          <div className="w-[22%] shrink-0 flex flex-col gap-4 overflow-y-auto">
            <WidgetErrorBoundary name="LeftPanel">
              <LeftPanel />
            </WidgetErrorBoundary>
          </div>
        </div>

        {/* Row 3: Bottom News Ticker */}
        <div className="shrink-0 mt-4">
          <WidgetErrorBoundary name="BottomTicker">
            <BottomTicker />
          </WidgetErrorBoundary>
        </div>
      </div>

      {/* Hidden: Background Music Player */}
      <WidgetErrorBoundary name="MusicPlayer">
        <MusicPlayer />
      </WidgetErrorBoundary>
    </div>
  );
}
