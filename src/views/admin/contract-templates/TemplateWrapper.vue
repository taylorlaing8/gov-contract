<template>
    <LoadingScreen v-if="loading"></LoadingScreen>
    <router-view @loading-change="updateLoading"></router-view>
</template>

<script lang="ts">
import { useRoute } from 'vue-router'
import router from '@/router'
import { defineComponent, ref } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

export default defineComponent({
    name: 'TemplateWrapper',

    components: {
        LoadingScreen,
    },
    
    setup() {
        const route = useRoute()
        if (route.name !== 'template-create' && route.name !== 'template-content') {
            router.push({
                name: 'admin-templates',
            })
        }
        
        const loading = ref(false)

        function updateLoading(status: boolean) {
            loading.value = status
        }

        return {
            loading, updateLoading,
        }
    }
})

</script>

<style scoped lang="scss">

</style>