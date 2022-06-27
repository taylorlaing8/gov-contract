import { createApp } from 'vue'
import store from './store'
import App from './App.vue'
import router from './router'
import vuetify from './plugins/vuetify'
import VueClipboard from 'vue3-clipboard'
import 'v-calendar/dist/style.css'

import { loadFonts } from './plugins/webfontloader'
loadFonts()

const app = createApp(App)

app.use(store)
app.use(router)
app.use(vuetify)
app.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
})
app.mount('#app')
