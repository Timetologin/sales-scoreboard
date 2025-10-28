/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#fff8e1',
          100: '#ffecb3',
          200: '#ffe082',
          300: '#ffd54f',
          400: '#ffca28',
          500: '#ffc107',
          600: '#ffb300',
          700: '#ffa000',
          800: '#ff8f00',
          900: '#ff6f00',
        },
        tiger: {
          orange: '#FF9500',
          darkOrange: '#FF7A00',
          black: '#2a2a2a',
          stripe: '#3d3d3d',
          yellow: '#FFD700',
          amber: '#FFB347',
        },
        dark: {
          bg: '#1a1a1a',
          card: '#2a2a2a',
          hover: '#3d3d3d',
          border: '#4a4a4a',
        }
      },
      backgroundImage: {
        'tiger-stripes': "repeating-linear-gradient(90deg, #FF9500 0px, #FF9500 20px, #3d3d3d 20px, #3d3d3d 40px)",
        'tiger-gradient': 'linear-gradient(135deg, #FF9500 0%, #FF7A00 50%, #3d3d3d 100%)',
        'dark-tiger': 'linear-gradient(135deg, #2a2a2a 0%, #3d3d3d 100%)',
        'alpha-tiger': 'linear-gradient(135deg, #FFD700 0%, #FF9500 50%, #3d3d3d 100%)',
      },
      animation: {
        'fadeIn': 'fadeIn 0.5s ease-in',
        'slideUp': 'slideUp 0.5s ease-out',
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'bounce-slow': 'bounce 2s infinite',
        'wiggle': 'wiggle 1s ease-in-out infinite',
        'prowl': 'prowl 4s ease-in-out infinite',
        'roar': 'roar 2s ease-in-out infinite',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { transform: 'translateY(20px)', opacity: '0' },
          '100%': { transform: 'translateY(0)', opacity: '1' },
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-3deg)' },
          '50%': { transform: 'rotate(3deg)' },
        },
        prowl: {
          '0%, 100%': { transform: 'translateX(0)' },
          '50%': { transform: 'translateX(10px)' },
        },
        roar: {
          '0%, 100%': { transform: 'scale(1)' },
          '50%': { transform: 'scale(1.05)' },
        }
      },
    },
  },
  plugins: [],
}