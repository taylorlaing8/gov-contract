<template>
    <div class="loading-component">
        <v-icon class="pr-5">mdi-reload</v-icon>
        <h2>Loading...</h2>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'LoadingScreen',

    setup() {
        return {}
    }
})

</script>

<style lang="scss" scoped>
.loading-component {
    width: 100%;
    height: 100%;
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    backdrop-filter: blur(2px);
    z-index: 999;
}
</style>