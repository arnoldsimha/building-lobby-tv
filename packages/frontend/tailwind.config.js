/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './index.html',
    './src/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        heebo: ['Heebo', 'system-ui', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#3B82F6',
          dark: '#2563EB',
          light: '#60A5FA',
          50: '#EFF6FF',
          100: '#DBEAFE',
          600: '#2563EB',
          700: '#1D4ED8',
          900: '#1E3A5F',
        },
        accent: {
          DEFAULT: '#F59E0B',
          dark: '#D97706',
          light: '#FBBF24',
        },
        'panel-bg': 'rgba(255, 255, 255, 0.85)',
        'panel-border': 'rgba(255, 255, 255, 0.25)',
        'glass-bg': 'rgba(255, 255, 255, 0.12)',
        'glass-border': 'rgba(255, 255, 255, 0.2)',
        urgent: {
          bg: '#FEE2E2',
          text: '#DC2626',
          border: '#DC2626',
        },
        'news-bg': 'rgba(15, 23, 42, 0.88)',
      },
      boxShadow: {
        'panel': '0 8px 32px rgba(0, 0, 0, 0.12), 0 2px 8px rgba(0, 0, 0, 0.08)',
        'panel-top': '0 -4px 24px rgba(0, 0, 0, 0.15)',
        'widget': '0 8px 60px rgba(0, 0, 0, 0.35), 0 4px 25px rgba(0, 0, 0, 0.20)',
        'widget-hover': '0 12px 70px rgba(0, 0, 0, 0.40), 0 6px 30px rgba(0, 0, 0, 0.25)',
        'glow-blue': '0 0 20px rgba(59, 130, 246, 0.3)',
        'glow-white': '0 0 40px rgba(255, 255, 255, 0.1)',
        'inner-light': 'inset 0 1px 0 rgba(255, 255, 255, 0.15)',
      },
      borderRadius: {
        'panel': '16px',
        'widget': '14px',
      },
      width: {
        'side-panel': '340px',
      },
      height: {
        ticker: '64px',
        'title-bar': '44px',
      },
      fontSize: {
        'building-name': ['40px', { lineHeight: '1.2', fontWeight: '800' }],
        'clock-time': ['80px', { lineHeight: '1', fontWeight: '800' }],
        'clock-seconds': ['36px', { lineHeight: '1', fontWeight: '300' }],
        'day-of-week': ['28px', { lineHeight: '1.3', fontWeight: '600' }],
        'date-text': ['22px', { lineHeight: '1.3', fontWeight: '400' }],
        'widget-title': ['17px', { lineHeight: '1.4', fontWeight: '700', letterSpacing: '0.02em' }],
        'widget-content': ['20px', { lineHeight: '1.5', fontWeight: '400' }],
        'widget-label': ['16px', { lineHeight: '1.4', fontWeight: '500' }],
        'news-ticker': ['22px', { lineHeight: '1.3', fontWeight: '500' }],
        'message-title': ['20px', { lineHeight: '1.4', fontWeight: '700' }],
        'message-text': ['18px', { lineHeight: '1.5', fontWeight: '400' }],
      },
      backgroundImage: {
        'gradient-header': 'linear-gradient(135deg, #1e3a5f 0%, #2563eb 50%, #3b82f6 100%)',
        'gradient-header-light': 'linear-gradient(135deg, #3b82f6 0%, #60a5fa 100%)',
        'gradient-ticker': 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
        'gradient-glass': 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
      },
      animation: {
        'fade-in': 'fade-in 1.5s ease-in-out',
        'pulse-soft': 'pulse-soft 3s ease-in-out infinite',
        'shimmer': 'shimmer 2s ease-in-out infinite',
      },
      keyframes: {
        'fade-in': {
          from: { opacity: '0' },
          to: { opacity: '1' },
        },
        'pulse-soft': {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.85' },
        },
        'shimmer': {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' },
        },
      },
    },
  },
  plugins: [],
};
