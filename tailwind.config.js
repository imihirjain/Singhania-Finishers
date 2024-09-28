/** @type {import('tailwindcss').Config} */
module.exports = {
  theme: {
   
  },
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",

  ],
  theme: {
    extend: {
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        'white': '#ffffff',
        'purple': '#3f3cbb',
        'midnight': '#121063',
        'metal': '#565584',
        'tahiti': '#3ab7bf',
        'silver': '#ecebff',
        'bubble-gum': '#ff77e9',
        'bermuda': '#78dcca',
        'Merchanta':'#7F265B',
        'gray':'#002F3A',
        'lightMerchanta':'#DED2D9',
        'gray3':'#828282',
        'placeholder':'#E0E0E0',
        'login':'#525252',
        'remember':'#A1A1A1',
        'darkgray':'#002F3A',
        'footer_red':'#770000',
        'foooter_bg':'#D9D9D9',
        'nav':'#F0F3F5',
        'body':'#C4C4C4',
        'header':'#E2E8F0',
        'header-font':'#464E5F',
        'title':'#1D3557',
        'total':'#457B9D',
        'backgrnd':'#DCE8F5'
      },
      fontFamily: {
        'sans': ['ui-sans-serif', 'system-ui'],
        'serif': ['ui-serif', 'Georgia'],
        'mono': ['ui-monospace', 'SFMono-Regular'],
        'display': ['Oswald',],
        'body': ['"Open Sans"',],
        'login':['Montserrat'],
        'forget':['Nunito Sans'],
        'heading':['Comfortaa'],
        'footer':['Inter'],
        'header':['Poppins']
       }
    },
  },
  plugins: [
    // ...
    require("@tailwindcss/forms"),

  ],
};
