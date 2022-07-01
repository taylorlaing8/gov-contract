// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'
import { createVuetify } from 'vuetify'

const darkTheme = {
  dark: false,
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    primary: '#1c2347',
    'primary-lighten-1': '#e0e1e6',
    'primary-darken-1': '#3700B3',
    secondary: '#ec7211',
    'secondary-darken-1': '#018786',
    error: '#B00020',
    info: '#2196F3',
    success: '#4CAF50',
    warning: '#FB8C00',
    grey: '#c4c4c4',
    'dark-grey': '#747474',
    'light-grey': '#efefef',
    'grey-text': '#c9c9c9',
  }
}

export default createVuetify({
    display: {
        mobileBreakpoint: 'sm',
        thresholds: {
            xs: 0,
            sm: 340,
            md: 540,
            lg: 800,
            xl: 1280,
        },
    },
    theme: {
        defaultTheme: 'darkTheme',
        themes: {
            darkTheme,
        }
    }
})
