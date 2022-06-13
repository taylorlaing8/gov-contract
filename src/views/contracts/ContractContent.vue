<template>
    <v-main>
        <v-row no-gutters class="py-5 justify-center">
            <v-col cols=11>
                <v-row>
                    <v-col cols="6">
                        <h2>{{ task.title }}</h2>
                        <span class="text-subtitle-1">{{ task.sub_title }}</span>
                    </v-col>
                    <v-col cols="6" class="text-right">
                        <span class="text-caption">Task ID: #{{ task.id }}</span>
                        <StatusIcon :status="task.status" :showTitle="true"></StatusIcon>
                    </v-col>
                </v-row>
                <v-row>
                    <v-col cols="4">
                        Gate
                    </v-col>
                </v-row>
            </v-col>
        </v-row>
    </v-main>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import type { Task } from '@/types/ContractData.type'
import StatusIcon from '@/components/StatusIcon.vue'

export default defineComponent({
    name: 'ContractContent',

    components: {
        StatusIcon,
    },

    props: {
        task: {
            type: Object as PropType<Task>,
            required: true
        }
    },

    setup() {
        return {}
    },
})
</script>

<style scoped></style>
