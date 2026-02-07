/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: '#0059a4',
                'pnpe-blue': '#0059a4',
                'pnpe-green': '#009e49',
                'pnpe-yellow': '#fcd116',
                'bg-dark': '#001a33',
                'bg-medium': '#00264d',
                'bg-light': '#003366',
                border: 'rgba(255, 255, 255, 0.1)',
            },
            fontFamily: {
                display: ['"Playfair Display"', 'serif'],
                sans: ['Inter', 'sans-serif'],
            },
            backdropBlur: {
                xs: '2px',
            },
        },
    },
    plugins: [],
}
