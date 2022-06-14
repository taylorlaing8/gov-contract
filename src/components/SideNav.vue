<template>
    <v-navigation-drawer v-if="!subNav" theme="dark" width="100%" permanent>
        <!-- <template v-if="">
            <v-list-item :prepend-avatar="''"></v-list-item>
            <v-divider></v-divider>
        </template> -->
        <v-list nav>
            <v-list-item
                v-for="link in headerNav.links"
                :key="link.id"
                :to="link.url"
                :title="link.title"
                :prepend-icon="link.icon"
            ></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDisplay } from 'vuetify'

export default defineComponent({
    name: 'SideNav',

    setup() {
        const display = useDisplay()

        const headerNav = ref({
            title: 'Laing Development',
            links: [
                {
                    id: 1,
                    title: 'Dashboard',
                    icon: 'mdi-view-dashboard',
                    url: '/',
                },
                {
                    id: 2,
                    title: 'Contacts',
                    icon: 'mdi-view-dashboard',
                    url: '/',
                },
                {
                    id: 3,
                    title: 'Positions',
                    icon: 'mdi-view-dashboard',
                    url: '/',
                },
                {
                    id: 4,
                    title: 'TEMP CONTRACT',
                    icon: 'mdi-view-dashboard',
                    url: '/contracts/21',
                },
            ],
        })

        return { display, headerNav }
    },
})
</script>
<style lang="scss" scoped>
//
</style>
