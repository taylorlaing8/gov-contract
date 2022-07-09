import { createApp } from 'vue'
import store from './store'
import App from './App.vue'
import router from './router'
import VueClipboard from 'vue3-clipboard'

import 'v-calendar/dist/style.css'

import PrimeVue from 'primevue/config'
// import 'primevue/resources/themes/md-light-indigo/theme.css'
import ToastService from 'primevue/toastservice'
import ConfirmationService from 'primevue/confirmationservice'
import 'primevue/resources/themes/saga-blue/theme.css'
import 'primevue/resources/primevue.min.css'
import 'primeicons/primeicons.css'
import 'primeflex/primeflex.scss'

import { loadFonts } from './plugins/webfontloader'
loadFonts()

const app = createApp(App)

app.use(store)
app.use(router)

app.use(PrimeVue)
app.use(ToastService)
app.use(ConfirmationService)

// import Button from 'primevue/button'
// app.component('p-button', Button)
// import DataTable from 'primevue/datatable'
// app.component('p-data-table', DataTable)
// import Column from 'primevue/column'
// app.component('p-column', Column)
import Calendar from 'primevue/calendar'
app.component('p-calendar', Calendar)

app.use(VueClipboard, {
    autoSetContainer: true,
    appendToBody: true,
})
app.mount('#app')
