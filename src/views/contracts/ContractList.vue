<template>
    <div class="contract-content-wrapper">
        <v-row class="justify-center" :no-gutters="true">
            <v-col cols="11">
                <v-card theme="light" class="px-8 py-5 my-5" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <h5 class="text-h5">Contracts</h5>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card theme="light" class="px-8 py-5 my-5" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <table class="contracts-table">
                                <thead>
                                    <tr>
                                        <th width="15%" class="text-left">UCID</th>
                                        <th width="24%" class="text-left">Title</th>
                                        <th width="15%" class="text-left">Type</th>
                                        <th width="10%" class="text-left">Value</th>
                                        <th width="15%" class="text-left">Awarded</th>
                                        <th width="15%" class="text-left">Need Date</th>
                                        <th width="5%" class="text-center">Status</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template
                                        v-for="contract in contracts"
                                        :key="contract.id"
                                    >
                                        <tr @click="openContract(contract.id)">
                                            <td width="15%" class="text-left">{{ contract.ucid }}</td>
                                            <td width="24%" class="text-left">{{ contract.title }}</td>
                                            <td width="15%" class="text-left">{{ contract.type }}</td>
                                            <td width="10%" class="text-left">{{ contract.value }}</td>
                                            <td width="15%" class="text-left">{{ new Date().toDateString(contract.award_date) }}</td>
                                            <td width="15%" class="text-left">{{ new Date().toDateString(contract.need_date) }}</td>
                                            <td width="5%" class="text-center">
                                                <StatusIcon
                                                    size="small"
                                                    :centered="true"
                                                    :status="contract.status"
                                                ></StatusIcon>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-btn
            color="primary"
            icon="mdi-plus"
            size="default"
            elevation="10"
            class="fab-primary"
            @click.prevent="showNewContract = true"
        ></v-btn>
    </div>
    <v-dialog v-model="showNewContract" scrollable width="auto">
        <v-card theme="light" class="pa-8 my-5" elevation="2" width="800px">
            <v-row class="justify-start">
                <v-col cols="12">
                    <h5 class="text-h5">Create New Position</h5>
                </v-col>
            </v-row>
            <v-row class="justify-start py-10">
                <v-col cols="6">
                    <v-text-field
                        color="primary"
                        label="Title"
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        color="primary"
                        label="Department"
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                    ></v-text-field>
                </v-col>
            </v-row>
            <v-row class="text-right">
                <v-col cols="12">
                    <v-btn
                        prepend-icon="mdi-close"
                        label="Save"
                        size="default"
                        variant="flat"
                        @click.prevent="showNewContract = false"
                    >
                        Close
                    </v-btn>
                </v-col>
            </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import router from '@/router'
import StatusIcon from '@/components/StatusIcon.vue'
import { ContractService } from '@/api/ContractService'
import type { Contract } from '@/types/ContractData.type'

export default defineComponent({
    name: 'ContractList',

    components: {
        StatusIcon,
    },

    setup() {
        const showNewContract = ref(false)

        const contracts = ref([] as Contract[])
        ContractService.list()
            .then((res) => {
                contracts.value = res.data
            })
            .catch((err) => {
                console.warn('Error Fetching Contracts', err)
            })

        function openContract(id: number) {
            router.push({
                name: 'contract-view',
                params: {
                    contract_id: id.toString(),
                    task: null,
                },
            })
        }

        return {
            showNewContract, contracts, openContract,
        }
    },
})
</script>

<style lang="scss" scoped>
.contracts-table {
    & tbody {
        & tr {
            &:hover {
                cursor: pointer;
                background-color: #1d9fca25;
                border-radius: 3px;
            }
        }
    }
}
</style>
