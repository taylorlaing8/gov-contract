<template>
    <router-view @loading-change="updateLoading"></router-view>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'ContractWrapper',

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