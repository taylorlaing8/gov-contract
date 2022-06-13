<template>
    <SideNavigation
        :navName="navName"
        :navItem="navItem"
        :navigation="dashNav"
        :subNav="true"
        v-model="currNav"
        @update:homeValue="setCurrNav($event)"
    ></SideNavigation>
    <v-main>
        <component :is="dashNav[currNav].component"></component>
    </v-main>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import SideNavigation from '../components/SideNavigation.vue'
import HomeDashboard from '../Home/HomeDashboard.vue'
import type AdminNav from '@/types/AdminNav.type'
import setNavigation from '../navigation/useNavigation.composable'

export default defineComponent({
    name: 'HomeNav',

    components: {
        SideNavigation,
        HomeDashboard,
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
        const dashNav: AdminNav[] = [
            {
                title: 'Home',
                slug: 'home',
                component: HomeDashboard,
            },
        ]

        const { setInitialNavigation, setCurrNav, currNav } = setNavigation()
        setInitialNavigation(props.navName, dashNav, props.navItem)

        return { dashNav, currNav, setCurrNav }
    },
})
</script>

<style scoped></style>
