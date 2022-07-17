<template>
    <div class="task-content col-12 px-5 py-4 bg-white border-round">
        <div class="grid align-items-center">
            <div class="col-9">
                <Skeleton width="70%" height="2rem" class="mb-2"></Skeleton>
                <Skeleton width="80%"></Skeleton>
            </div>
            <div class="col-3">
                <div class="flex align-items-center justify-content-end">
                    <Skeleton shape="circle" size="1.5rem" class="mr-2"></Skeleton>
                    <div>
                        <Skeleton width="6rem" height="1.5rem"></Skeleton>
                    </div>
                </div>
            </div>
        </div>
        <div class="grid align-items-center mt-5">
            <div class="col-4">
                <Skeleton width="100%" height="2rem"></Skeleton>
            </div>
            <div class="col-4">
                <Skeleton width="90%" height="2rem"></Skeleton>
            </div>
            <div class="col-4">
                <Skeleton width="90%" height="2rem"></Skeleton>
            </div>
        </div>
        <div class="grid align-items-center mt-5">
            <div class="col-4">
                <Skeleton width="70%" height="2rem"></Skeleton>
            </div>
            <div class="col-4">
                <Skeleton width="100%" height="2rem"></Skeleton>
            </div>
            <div class="col-4">
                <Skeleton width="100%" height="2rem"></Skeleton>
            </div>
        </div>
        <div class="grid align-items-center mt-2">
            <div class="col-4">
                <Skeleton width="100%" height="14rem"></Skeleton>
            </div>
            <div class="col-8">
                <Skeleton width="100%" height="18rem"></Skeleton>
            </div>
        </div>
        <div class="grid align-items-center mt-5">
            <div class="col-6">
                <Skeleton width="100%" height="2rem"></Skeleton>
            </div>
        </div>
        <div class="grid align-items-center mt-5">
            <div class="col-12">
                <Skeleton width="100%" height="5rem"></Skeleton>
            </div>
        </div>
        <div class="grid align-items-center mt-5">
            <div class="col-12">
                <Skeleton width="100%" height="1rem" class="mb-2"></Skeleton>
                <Skeleton width="100%" height="1rem"></Skeleton>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import Skeleton from 'primevue/skeleton'

export default defineComponent({
    name: 'TaskSkeleton',

    components: {
        Skeleton,
    },

    setup() {
        return {}
    }
})

</script>

<style scoped>

</style>