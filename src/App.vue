<template>
    <div class="app-container">
        <Toast />
        <header-nav />
        <div class="app-content">
            <router-view />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
// import SideNav from '@/components/SideNav.vue'
import HeaderNav from './components/HeaderNav.vue'
import Toast from 'primevue/toast'

export default defineComponent({
    name: 'App',

    components: {
        // SideNav,
        Toast,
        HeaderNav,
    },

    setup() {
        return {}
    },
})
</script>
<style lang="scss" scoped>
.app-content {
    position: absolute;
    width: 100%;
    top: 75.5px;
    min-height: calc(100vh - 75.5px);
    background: #f7f7f7;
}
</style>
