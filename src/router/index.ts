import store from '@/store'
import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '@/views/HomeView.vue'
import LoginView from '@/views/LoginView.vue'

import ContractWrapper from '@/views/contracts/ContractWrapper.vue'
import ContractList from '@/views/contracts/ContractList.vue'

import BuildWrapper from '@/views/contracts/contract-build/BuildWrapper.vue'
import BuildDetails from '@/views/contracts/contract-build/BuildDetails.vue'
import BuildPocs from '@/views/contracts/contract-build/BuildPocs.vue'
import BuildSchedule from '@/views/contracts/contract-build/BuildSchedule.vue'
import BuildConfirm from '@/views/contracts/contract-build/BuildConfirm.vue'

import ContractNavigation from '@/views/contracts/ContractNavigation.vue'
import ContractOverview from '@/views/contracts/ContractOverview.vue'
import TaskDetail from '@/views/contracts/TaskDetail.vue'

import PageNotFound from '@/views/PageNotFound.vue'
import ErrorView from '@/views/ErrorView.vue'

import AdminNav from '@/views/admin/AdminNav.vue'
import PocList from '@/views/admin/PocList.vue'
import PositionsList from '@/views/admin/PositionsList.vue'

import TemplateList from '@/views/admin/admin-templates/TemplateList.vue'
import TemplateWrapper from '@/views/admin/admin-templates/TemplateWrapper.vue'
import TemplateBuilder from '@/views/admin/admin-templates/TemplateBuilder.vue'
import TemplateContent from '@/views/admin/admin-templates/TemplateContent.vue'

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
                name: 'contract-list',
                component: ContractList,
            },
            {
                path: 'create',
                name: 'contract-build',
                component: BuildWrapper,
                children: [
                    {
                        path: '',
                        name: 'build-details',
                        component: BuildDetails,
                    },
                    {
                        path: 'pocs',
                        name: 'build-pocs',
                        component: BuildPocs,
                    },
                    {
                        path: 'schedule',
                        name: 'build-schedule',
                        component: BuildSchedule,
                    },
                    {
                        path: 'confirm',
                        name: 'build-confirm',
                        component: BuildConfirm,
                    },
                ]
            },
            {
                path: ':contract_id',
                name: 'contract-detail',
                component: ContractNavigation,
                props(route) {
                    return {
                        contract_id: parseInt(route.params.contract_id)
                    }
                },
                children: [
                    {
                        path: '',
                        name: 'contract-overview',
                        component: ContractOverview,
                        props(route) {
                            return {
                                contract_id: parseInt(route.params.contract_id)
                            }
                        },
                    },
                    {
                        path: ':task',
                        name: 'contract-task-detail',
                        component: TaskDetail,
                    },
                ]
            },
        ],
        beforeEnter: [verifyAuthorization],
    },
    {
        path: '/admin',
        name: 'admin',
        component: AdminNav,
        children: [
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
                name: 'admin-templates',
                component: TemplateWrapper,
                children: [
                    {
                        path: '',
                        component: TemplateList,
                        name: 'template-list'
                    },
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

export default router
