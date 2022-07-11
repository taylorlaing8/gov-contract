<template>
    <div class="grid justify-content-center py-5">
        <div class="col-11 p-0">
            <div class="grid">
                <div class="col p-0 inline-flex">
                    <Menu :model="navItems" />
                    <div class="col px-5 py-4 ml-3 bg-white border-1 surface-border border-round-sm admin-content">
                        <router-view></router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import Menu from 'primevue/menu'
import { useToast } from 'primevue/usetoast'

export default defineComponent({
    name: 'AdminNav',

    components: {
        Menu,
    },

    setup() {
        const route = useRoute()
        const toast = useToast()

        // TOAST COMMAND
        // toast.add({severity:'info', summary:'Updated', detail:'Data Updated', life: 3000})

        const navItems = ref([
            {
                label: 'Admin Panel',
                items: [
                    {
                        label: 'Team Members',
                        icon: 'pi pi-users',
                        command: () => {
                            router.push({
                                name: 'admin-pocs',
                                params: {},
                            })
                        }
                    },
                    {
                        label: 'Positions',
                        icon: 'pi pi-id-card',
                        command: () => {
                            router.push({
                                name: 'admin-positions',
                                params: {},
                            })
                        }
                    },
                    {
                        label: 'Holidays',
                        icon: 'pi pi-calendar',
                        command: () => {
                            router.push({
                                name: 'admin-holidays',
                                params: {},
                            })
                        }
                    },
                    {
                        label: 'Templates',
                        icon: 'pi pi-th-large',
                        command: () => {
                            router.push({
                                name: 'template-list',
                                params: {},
                            })
                        }
                    },
                ],
            },
        ])

        function defaultRoute() {
            router.push({
                name: 'admin-pocs',
                params: {},
            })
        }
        if (route.name === 'admin') defaultRoute()

        watch(() => route.name, () => {
            if (route.name === 'admin') {
                defaultRoute()
            }
        })

        return { navItems }
    },
})
</script>
<style lang="scss" scoped>
.admin-content {
    .p-inputtext {
        width: 100%;
    }
    .p-dropdown {
        max-width: 15rem;
    }
}
</style>
