<template>
    <Menubar :model="navItems" class="shadow-2">
        <template #start>
            <router-link to="/">
                <img alt="Logo" :src="require('../../public/logo_dark.png')" height="40" />
            </router-link>
        </template>
        <template #item="{item}">
            <router-link :to="item.to" custom v-slot="{ navigate }">
                <Button :label="item.label" @click="navigate" class="p-button-raised p-button-nav p-button-rounded p-button-sm" />
            </router-link>
        </template>
        <!-- <template #end>
            <ul class="p-menubar-root-list">
                <li v-for="(item, idx) in navItems" :key="idx" class="p-menuitem">
                    <router-link :to="item.to" custom v-slot="{ navigate }">
                        <Button :label="item.label" @click="navigate" class="p-button-raised p-button-secondary p-button-rounded p-button-sm" />
                    </router-link>
                </li>
            </ul>
        </template> -->
    </Menubar>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import Menubar from 'primevue/menubar'
import Button from 'primevue/button'

export default defineComponent({
    name: 'NavBar',

    components: {
        Menubar,
        Button,
    },

    setup() {
        const navItems = ref([
            {
                label:'Home',
                icon:'pi pi-home',
                to: '/',
            },
            {
                label:'Contracts',
                icon:'pi pi-file',
                to: '/contracts',
            },
            {
                label:'Admin',
                icon:'pi pi-th-large',
                to: '/admin',
            }
        ])
        const headerNav = ref({
            title: 'Laing Development',
            links: [
                {
                    title: 'Home',
                    url: '/',
                },
                {
                    title: 'Contracts',
                    url: '/contracts',
                },
                {
                    title: 'Admin',
                    url: '/admin',
                },
            ],
        })

        return { navItems, headerNav }
    },
})
</script>
<style lang="scss" scoped>
.p-menubar {
    border: 0px;
    border-radius: 0px 0px 2px 2px;
    padding: 1rem;
    background-color: $primary-color;
    justify-content: space-between;
    position: fixed;
    z-index: 999;
    width: 100%;
    top: 0px;
    left: 0px;
    
    // & .p-menuitem .p-menuitem-link:focus {
    //     &:active {
    //         background: rgba(255, 255, 255, 0.10);
    //     }
    //     &:focus {
    //         background: none !important;
    //     }
    // }

    & .p-button-secondary {
        color: white;
        font-weight: 400;
        background: transparent;
        border: 0px;

        &:enabled:hover {
            background: #ffffff35;
        }
        &:enabled:focus {
            // background: transparent;
            background: #ffffff35;
            box-shadow: none;
        }
    }
}
</style>
