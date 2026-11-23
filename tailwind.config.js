export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        navy: '#142B45', midnight: '#102238', ocean: '#2676C9', teal: '#18A6A0',
        orange: '#E69A45', soft: '#EAF2FA', cool: '#F5F8FC', muted: '#667085', line: '#E2E8F0', alert: '#D92D20',
      },
      fontFamily: { display: ['Manrope', 'sans-serif'], sans: ['Inter', 'sans-serif'] },
      boxShadow: { card: '0 1px 2px rgba(16,34,56,.06), 0 8px 24px rgba(16,34,56,.06)', lift: '0 24px 60px rgba(16,34,56,.18)' },
    },
  },
  plugins: [],
}
