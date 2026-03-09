/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{html,ts}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#EBF0FF',
          100: '#C7D4FF',
          400: '#5C7CFA',
          500: '#3B5BDB',
          600: '#2F4AB8',
          700: '#243A95',
        },
        secondary: {
          400: '#63E6BE',
          500: '#20C997',
          600: '#1AAB7D',
          700: '#158C66',
        },
        accent: {
          400: '#FFD08A',
          500: '#FFA94D',
          600: '#E69435',
        },
      },
      boxShadow: {
        soft: '0 2px 8px rgba(0, 0, 0, 0.04)',
        card: '0 4px 12px rgba(0, 0, 0, 0.08)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
  ],
};
