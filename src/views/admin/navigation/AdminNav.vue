<template>
    <v-card class="fill-height">
        <v-layout class="fill-height">
            <SideNavigation
                :navigation="adminNav"
                :subNav="false"
                avatar="https://randomuser.me/api/portraits/women/75.jpg"
                v-model="currNav"
                @update:modelValue="currNav = $event"
            ></SideNavigation>
            <component
                :is="adminNav[currNav].component"
                navName="admin"
                :navItem="adminNav[currNav].slug"
            ></component>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import SideNavigation from '../components/SideNavigation.vue'
import HomeNav from './HomeNav.vue'
import StoreNav from './StoreNav.vue'
import { useRoute } from 'vue-router'
import type AdminNav from '@/types/AdminNav.type'

export default defineComponent({
    name: 'AdminNav',

    components: {
        SideNavigation,
        HomeNav,
        StoreNav,
    },

    setup() {
        const adminNav: AdminNav[] = [
            {
                title: 'Dashboard',
                slug: 'dashboard',
                icon: 'mdi-view-dashboard',
                component: HomeNav,
            },
            {
                title: 'Store',
                slug: 'store',
                icon: 'mdi-store',
                component: StoreNav,
            },
        ]

        const route = useRoute()
        const navAvailable = adminNav.findIndex((nav) => {
            return nav.slug === route.params.navItem
        })
        const currNav = ref(navAvailable >= 0 ? navAvailable : 0)

        return { adminNav, currNav }
    },
})
</script>
<style lang="scss" scoped></style>
