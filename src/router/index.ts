import store from '@/store'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ContractWrapper from '@/views/contracts/ContractWrapper.vue'
import ContractList from '@/views/contracts/ContractList.vue'
import ContractNavigation from '@/views/contracts/ContractNavigation.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import ErrorView from '@/views/ErrorView.vue'

import AdminNav from '@/views/admin/AdminNav.vue'
import PocList from '@/views/admin/PocList.vue'
import PositionsList from '@/views/admin/PositionsList.vue'
import TemplateList from '@/views/admin/TemplateList.vue'
import HolidayList from '@/views/admin/HolidayList.vue'

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
    // {
    //     path: '/admin/:nav_item?',
    //     name: 'admin',
    //     component: AdminDashboard,
    //     beforeEnter: [verifyAuthorization],
    // },
    {
        path: '/admin',
        name: 'admin',
        component: AdminNav,
        children: [
            // {
            //     path: '',
            //     component: AdminDashboard,
            //     name: 'admin-dashboard'
            // },
            {
                path: 'pocs',
                component: PocList,
                name: 'admin-pocs',
                props: true,
            },
            {
                path: 'positions',
                component: PositionsList,
                name: 'admin-positions',
                props: true,
            },
            {
                path: 'templates',
                component: TemplateList,
                name: 'admin-templates',
                props: true,
            },
            {
                path: 'holidays',
                component: HolidayList,
                name: 'admin-holidays',
                props: true,
            }
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
