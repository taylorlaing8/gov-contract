import store from '@/store'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'
import ContractWrapper from '@/views/contracts/ContractWrapper.vue'
import ContractList from '@/views/contracts/ContractList.vue'
import ContractBuilder from '@/views/contracts/ContractBuilder.vue'
import ContractNavigation from '@/views/contracts/ContractNavigation.vue'
import PageNotFound from '@/views/PageNotFound.vue'
import ErrorView from '@/views/ErrorView.vue'

import AdminNav from '@/views/admin/AdminNav.vue'
import PocList from '@/views/admin/PocList.vue'
import PositionsList from '@/views/admin/PositionsList.vue'
import TemplateList from '@/views/admin/TemplateList.vue'
import HolidayList from '@/views/admin/HolidayList.vue'

import TemplateWrapper from '@/views/admin/contract-templates/TemplateWrapper.vue'
import TemplateBuilder from '@/views/admin/contract-templates/TemplateBuilder.vue'
import TemplateContent from '@/views/admin/contract-templates/TemplateContent.vue'

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
                path: 'create',
                component: ContractBuilder,
                name: 'contract-create'
            },
            {
              path: ':contract_id/:task?',
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
        path: '/template',
        name: 'template',
        component: TemplateWrapper,
        children: [
            {
                path: 'create',
                component: TemplateBuilder,
                name: 'template-create'
            },
            {
              path: ':template_id',
              component: TemplateContent,
              name: 'template-content',
              props(route) {
                return {
                    template_id: parseInt(route.params.template_id)
                }
              },
            },
        ],
        beforeEnter: [verifyAuthorization],
    },
    {
        path: '/template/build',
        component: TemplateBuilder,
        name: 'template-builder',
        props: true,
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
