<template>
    <SideNavigation
        :navName="navName"
        :navItem="navItem"
        :navigation="storeNav"
        :subNav="true"
        v-model="currNav"
        @update:modelValue="setCurrNav($event)"
    ></SideNavigation>
    <v-main>
        <component :is="storeNav[currNav].component"></component>
    </v-main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SideNavigation from '../components/SideNavigation.vue'
import StoreDashboard from '../Store/StoreDashboard.vue'
import OrderPanel from '../Store/OrderPanel.vue'
import InvoicePanel from '../Store/InvoicePanel.vue'
import SubscriptionPanel from '../Store/SubscriptionPanel.vue'
import ProductPanel from '../Store/ProductPanel.vue'
import type AdminNav from '@/types/AdminNav.type'
import setNavigation from '../navigation/useNavigation.composable'

export default defineComponent({
    name: 'StoreNav',

    components: {
        SideNavigation,
        StoreDashboard,
        OrderPanel,
        InvoicePanel,
        SubscriptionPanel,
    },

    props: {
        navName: {
            type: String,
            required: true,
        },
        navItem: {
            type: String,
            required: true,
        },
    },

    setup(props) {
        const storeNav: AdminNav[] = [
            {
                title: 'Dashboard',
                slug: 'dashboard',
                component: StoreDashboard,
            },
            {
                title: 'Products',
                slug: 'products',
                component: ProductPanel,
            },
            {
                title: 'Orders',
                slug: 'orders',
                component: OrderPanel,
            },
            {
                title: 'Invoices',
                slug: 'invoices',
                component: InvoicePanel,
            },
            {
                title: 'Subscriptions',
                slug: 'subscriptions',
                component: SubscriptionPanel,
            },
        ]

        const { setInitialNavigation, setCurrNav, currNav } = setNavigation()
        setInitialNavigation(props.navName, storeNav, props.navItem)

        return { storeNav, currNav, setCurrNav }
    },
})
</script>

<style scoped></style>
