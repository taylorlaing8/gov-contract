import store from '@/store'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ContractWrapper from '@/views/contracts/ContractWrapper.vue'
import ContractList from '@/views/contracts/ContractList.vue'
import ContractNavigation from '@/views/contracts/ContractNavigation.vue'
import POCDashboard from '@/views/pocs/POCDashboard.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import ErrorView from '@/views/ErrorView.vue'

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
        path: '/pocs/:nav_item?',
        name: 'pocs',
        component: POCDashboard,
        beforeEnter: [verifyAuthorization],
    },
    {
        path: '/contracts',
        name: 'contracts',
        component: ContractWrapper,
        children: [
            {
                path: '',
                component: ContractList,
                name: 'contract-list'
            },
            {
              path: ':contract_id/:task?', // FIX THIS!!!! FOR SOME REASON REFRESHING ON A SUBTASK PAGE ROUTES YOU TO THE contract_id PAGE ONLY
              component: ContractNavigation,
              name: 'contract-view',
              props(route) {
                return {
                    contract_id: parseInt(route.params.contract_id)
                }
              },
            },
        ],
        beforeEnter: [verifyAuthorization],
    },
    {
        path: '/error',
        name: 'error',
        component: ErrorView,
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
    store.dispatch('inspectToken')

    if (to.name !== 'login' && !store.state.jwt) {
        localStorage.setItem('route', to.fullPath)
        next({ name: 'login' })
    } else if (to.name !== 'login' && localStorage.getItem('route')) {
        localStorage.removeItem('route')
        next()
    } else {
        next()
    }
}

// router.beforeEach((to, from, next) => {

// })

export default router
