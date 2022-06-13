<template>
    <v-app>
        <header-nav />
        <v-main>
            <v-container fluid fill-height class="pa-0 fill-height ld-main">
                <router-view />
            </v-container>
        </v-main>
    </v-app>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import HeaderNav from './components/HeaderNav.vue'

export default defineComponent({
    name: 'App',

    components: {
        HeaderNav,
    },

    setup() {
        return
    },
})
</script>
<style lang="scss" scoped>
.ld-main {
    min-height: calc(100vh - 186px);
}
</style>
