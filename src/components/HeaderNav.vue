<template>
    <v-app-bar app rounded height="90" color="white" elevation="3">
        <v-container>
            <v-row align="center">
                <router-link to="/">
                    <img
                        :src="require('../../public/logo_dark.png')"
                        height="50"
                    />
                </router-link>

                <v-spacer></v-spacer>

                <template v-if="display.lgAndUp.value">
                    <v-btn
                        v-for="link in headerNav.links"
                        :key="link.title"
                        :to="link.url"
                        variant="text"
                        size="small"
                        rounded
                    >
                        {{ link.title }}
                    </v-btn>
                </template>
            </v-row>
        </v-container>
    </v-app-bar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { useDisplay } from 'vuetify'

export default defineComponent({
    name: 'NavBar',

    setup() {
        const display = useDisplay()

        const headerNav = ref({
            title: 'Laing Development',
            links: [
                {
                    title: 'Dashboard',
                    url: '/',
                },
                {
                    title: 'Contacts',
                    url: '/',
                },
                {
                    title: 'Positions',
                    url: '/',
                },
                {
                    title: 'TEMP CONTRACT',
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
