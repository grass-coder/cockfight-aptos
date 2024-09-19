import { Button, Text, colorsTuple, createTheme } from "@mantine/core"

const theme = {
    defaultGradient: {
      from: '#FF9D2B',
      to: '#FF4802',
      deg: 30
    },
    colors: {
      'custom-orange': ['#FF9D2B', '#FF4802'],
      'light-orange': ['#FFE7D5'],
      'dark-grey': ['#212121'],
      'grey': ['#A9A9A9'],
      'black': ['#000000'],
      'white': ['#FFFFFF'],
    },
    fontFamily: 'poppins, sans-serif',
    globalStyles: (theme) => ({
      '*': {
        fontWeight: 'bold'
      },
      a: {
        textDecoration: 'none',
      },
      '.linearGradientBg': {
        backgroundImage: "linear-gradient(30deg, #FF9D2B 0%, #FF4802 100%)"
      }
    }),
    components: {
      Button: {
        sizes: {
          xl: (theme) => ({
            root: {
              fontSize: '24px',
              padding: '16px 24px',
              borderRadius: '32px',
              margin: '24px',
              borderWidth: '3px',
            },
          }),
          lg: (theme) => ({
            root: {
              fontSize: '20px',
              padding: '12px 24px',
              borderRadius: '24px',
              margin: '0px 16px',
              borderWidth: '1px',
            },
          }),
        }

      },
      Title: {
        styles: {
          root: {
            '&:is(h1)': {
              fontSize: '128px',
              lineHeight: '0.9',
              letterSpacing: '-2px'
             },
            '&:is(h2)': {
              fontSize: '72px',
              lineHeight: '0.9',
              letterSpacing: '-2px'
             },
            '&:is(h3)':  {
              fontSize: '36px',
              lineHeight: '1',
              letterSpacing: '-1px'
             },
            '&:is(h4)':{
              fontSize: '24px',
              lineHeight: '1',
              letterSpacing: '-1px'
            },
            textAlign: 'center',

          }
        }
      }
    },
  }

export default theme