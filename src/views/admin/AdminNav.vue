<template>
    <v-navigation-drawer width="200" permanent>
        <v-list nav>
            <v-list-item
                v-for="navItem in nav"
                :key="navItem.id"
                :title="navItem.title"
                :prepend-icon="navItem.icon"
                :active="$route.name === navItem.slug"
                active-color="primary"
                @click="updateActiveNav(navItem.slug)"
            ></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <router-view :nav="activeNav"></router-view>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'

interface navLink {
    title: string
    slug: string
    icon: string
}

export default defineComponent({
    name: 'AdminNav',

    setup() {
        const route = useRoute()

        const nav = ref([
            {
                title: 'Team Members',
                slug: 'admin-pocs',
                icon: 'mdi-account-group',
            },
            {
                title: 'Positions',
                slug: 'admin-positions',
                icon: 'mdi-badge-account-horizontal',
            },
            {
                title: 'Templates',
                slug: 'admin-templates',
                icon: 'mdi-file-document-multiple'
            },
            {
                title: 'Holidays',
                slug: 'admin-holidays',
                icon: 'mdi-calendar-star'
            }
        ] as navLink[])

        const activeNav = ref({} as navLink)
        watch(() => route.name, () => {
            if (route.name === 'admin') updateActiveNav()
        })

        function updateActiveNav(nSlug?: string) {
            let navItem: navLink|undefined = undefined
            const slug = nSlug ? nSlug : route.name ? route.name : null

            if (slug) navItem = nav.value.find((n) => n.slug === slug)

            activeNav.value = navItem ? navItem : nav.value[0]
            router.push({
                name: activeNav.value.slug,
                params: {},
            })
        }
        updateActiveNav()

        return {
            nav, activeNav, updateActiveNav,
        }
    },
})
</script>
<style lang="scss" scoped>
//
</style>
