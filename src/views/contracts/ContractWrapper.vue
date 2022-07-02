<template>
    <LoadingScreen v-if="loading"></LoadingScreen>
    <router-view @loading-change="updateLoading"></router-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

export default defineComponent({
    name: 'ContractWrapper',

    components: {
        LoadingScreen,
    },
    
    setup() {
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