// Styles
import '@mdi/font/css/materialdesignicons.css'
import 'vuetify/styles'

// Vuetify
import { createVuetify } from 'vuetify'

export default createVuetify({
    // https://vuetifyjs.com/en/introduction/why-vuetify/#feature-guides
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
        themes: {
            light: {
                dark: false,
                colors: {
                    primary: '#1D9FCA',
                    primaryLight: '#65d0fd',
                    primaryDark: '#007099',
                    secondary: '#80deea',
                    secondaryLight: '#b4ffff',
                    secondaryDark: '#4bacb8',
                },
            },
        },
    },
})
