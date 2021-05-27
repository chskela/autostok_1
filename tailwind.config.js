module.exports = {
  mode: 'jit',
  plugins: [],
  darkMode: false,
  purge: [
    './app/**/*.{js,ts,jsx,tsx}', 
    './pages/**/*.{js,ts,jsx,tsx}', 
    './layouts/**/*.{js,ts,jsx,tsx}', 
    './components/**/*.{js,ts,jsx,tsx}'
  ],
  theme: { extend: {} },
  variants: { extend: {} },
}
