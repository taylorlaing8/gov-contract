import store from '../store'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ContractDashboard from '@/views/contracts/ContractDashboard.vue'
import AdminNav from '@/views/admin/navigation/AdminNav.vue'
import PageNotFound from '@/views/PageNotFound.vue'

const routes = [
    {
        path: '/',
        name: 'home',
        component: HomeView,
    },
    {
        path: '/login',
        name: 'login',
        component: LoginView,
    },
    {
        path: '/contracts/:contract_id/:task?',
        name: 'contract',
        component: ContractDashboard,
    },
    {
        path: '/admin',
        component: AdminNav,
        name: 'admin-view',
        redirect: '/admin/dashboard/home',
    },
    {
        path: '/admin/:navItem/:navSubItem',
        name: 'admin',
        component: AdminNav,
        beforeEnter: [verifyAuthorization],
    },
    {
        path: '/:pathMatch(.*)*',
        name: 'PageNotFound',
        component: PageNotFound,
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        return {
            top: 0,
            behavior: 'smooth',
        }
    },
})

function verifyAuthorization(to: any, from: any, next: any) {
    setTimeout(() => {
        store.dispatch('inspectToken')
    }, 1000)

    if (to.name !== 'login' && !store.state.jwt) {
        localStorage.setItem('route', to.fullPath)
        next({ name: 'login' })
    } else if (to.name !== 'login' && localStorage.getItem('route')) {
        localStorage.removeItem('route')
    }

    next()
}

// router.beforeEach((to, from, next) => {

// })

export default router
