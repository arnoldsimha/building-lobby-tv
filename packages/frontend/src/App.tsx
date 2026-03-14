import { Component, type ReactNode, type ErrorInfo } from 'react';
import DisplayScreen from './components/layout/DisplayScreen';

/* ===== Top-Level Error Boundary ===== */
interface ErrorState {
  hasError: boolean;
  error: Error | null;
}

class AppErrorBoundary extends Component<{ children: ReactNode }, ErrorState> {
  constructor(props: { children: ReactNode }) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error: Error): ErrorState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[AppErrorBoundary] Fatal error:', error.message);
    console.error('[AppErrorBoundary] Stack:', errorInfo.componentStack);
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="w-screen h-screen bg-gradient-to-br from-indigo-400 to-purple-600 flex items-center justify-center font-heebo" dir="rtl">
          <div className="bg-white/95 rounded-2xl p-10 max-w-xl text-center shadow-2xl">
            <div className="text-5xl mb-4">⚠️</div>
            <h1 className="text-2xl font-bold text-red-600 mb-3">שגיאה באפליקציה</h1>
            <p className="text-lg text-gray-600 mb-4">
              {this.state.error?.message ?? 'Unknown error'}
            </p>
            <button
              onClick={() => window.location.reload()}
              className="mt-4 px-6 py-3 bg-primary text-white rounded-lg text-lg font-medium hover:bg-primary-dark transition-colors"
            >
              רענן דף
            </button>
          </div>
        </div>
      );
    }
    return this.props.children;
  }
}

/* ===== App Root ===== */
export default function App() {
  console.log('[App] Rendering...');
  return (
    <AppErrorBoundary>
      <DisplayScreen />
    </AppErrorBoundary>
  );
}
