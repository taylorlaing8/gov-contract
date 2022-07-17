<template>
    <div class="content-wrapper py-5">
        <div class="grid justify-content-center">
            <div class="col-11 px-5 py-4 bg-white border-1 surface-border border-round-sm">
                <div class="grid align-items-center">
                    <div class="col-8">
                        <h1>Contract List</h1>
                    </div>
                    <div class="col-4 text-right">
                        <router-link to="/contracts/create">
                            <Button
                                label="Contract"
                                icon="pi pi-plus"
                                class="p-button-secondary header-button"
                            />
                        </router-link>
                    </div>
                    <div class="col-12 mt-4">
                        <DataTable
                            :value="contracts"
                            removableSort
                            responsiveLayout="scroll"
                            :paginator="true"
                            :rows="10"
                            :loading="loading"
                            :rowHover="true"
                            stripedRows
                            selectionMode="single"
                            class="p-datatable-sm"
                            paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                            :rowsPerPageOptions="[10, 20, 50]"
                            currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                            @row-click="openContract($event.data.id)"
                        >
                            <Column
                                field="ucid"
                                header="UCID"
                                :sortable="true"
                            ></Column>
                            <Column
                                field="title"
                                header="Title"
                                :sortable="true"
                            ></Column>
                            <Column
                                field="value"
                                header="Value"
                                :sortable="true"
                            ></Column>
                            <Column
                                field="award_date"
                                header="Awarded"
                                :sortable="true"
                            ></Column>
                            <Column
                                field="need_date"
                                header="Need Date"
                                :sortable="true"
                            ></Column>
                            <Column
                                field="status"
                                header="Status"
                                :sortable="true"
                            >
                                <template #body="slotProps">
                                    <StatusIcon
                                        :status="slotProps.data.status"
                                        :showTitle="true"
                                    ></StatusIcon>
                                </template>
                            </Column>
                            <!-- <template #paginatorstart>
                                <Button icon="pi pi-refresh" class="p-button-text" :loading="loading" @click="getContracts"/>
                            </template>
                            <template #paginatorend>
                                <Button icon="pi pi-cloud" class="p-button-text" />
                            </template> -->
                        </DataTable>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import router from '@/router'
import StatusIcon from '@/components/StatusIcon.vue'
import { ContractService } from '@/api/ContractService'
import type { Contract } from '@/types/ContractData.type'
import { useToast } from 'primevue/usetoast'

import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

export default defineComponent({
    name: 'ContractList',

    components: {
        StatusIcon,
        Button,
        DataTable,
        Column,
    },

    setup(props) {
        const showNewContract = ref(false)
        const loading = ref(false)
        const toast = useToast()

        const contracts = ref([] as Contract[])
        function getContracts() {
            loading.value = true
            ContractService.list()
                .then((res) => {
                    contracts.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Contracts', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Loading Contracts',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                })
        }
        getContracts()

        function openContract(id: number) {
            router.push({
                name: 'contract-overview',
                params: {
                    contract_id: id.toString(),
                },
            })
        }

        return {
            showNewContract,
            loading,
            getContracts,
            contracts,
            openContract,
        }
    },
})
</script>

<style lang="scss" scoped>
//
</style>
