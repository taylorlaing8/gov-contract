<template>
    <v-app-bar app height="60" theme="dark" elevation="3">
        <v-row align="center" class="px-5">
            <router-link to="/">
                <img
                    :src="require('../../public/logo_light.png')"
                    height="30"
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
                    title: 'Home',
                    url: '/',
                },
                {
                    title: 'Contacts',
                    url: '/',
                },
                {
                    title: 'POCs',
                    url: '/pocs',
                },
                {
                    title: 'Templates',
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
