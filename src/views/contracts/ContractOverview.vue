<template>
    <v-main class="contract-content-wrapper">
        <v-row no-gutters class="justify-center">
            <v-col cols="11">
                <v-card class="px-8 py-5 my-5" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="8">
                            <h5 class="text-h5">{{contract.title}}</h5>
                            <p class="text-subtitle-1">{{ contract.type }}</p>
                        </v-col>
                        <v-col cols="4" class="text-right">
                            <span class="text-caption"
                                >Contract ID: #{{ contract.id }}</span
                            >
                            <StatusIcon
                                :status="contract.status"
                                :showTitle="true"
                            ></StatusIcon>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-btn
            color="primary"
            icon="mdi-pencil"
            size="default"
            class="fab-primary"
        ></v-btn>
    </v-main>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
// import type { Contract } from '@/types/ContractData.type'
import StatusIcon from '@/components/StatusIcon.vue'
import type { Contract } from '@/types/ContractData.type'

export default defineComponent({
    name: 'ContractContent',

    components: {
        StatusIcon,
    },

    props: {
        contract: {
            type: Object as PropType<Contract>,
            required: true,
        },
    },

    setup(props) {
        return {}
    },
})
</script>

<style lang="scss" scoped>
.contract-content-wrapper {
    background-color: #75726b;
    height: calc(100vh - 60px);
    overflow-y: scroll;
}
</style>
