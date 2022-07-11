<template>
    <div class="grid align-items-center">
        <div class="col-8">
            <h1>Templates</h1>
        </div>
        <div class="col-4 text-right">
            <Button
                label="Template"
                icon="pi pi-plus"
                class="p-button-secondary header-button"
                @click="newTemplate"
            />
        </div>
        <div class="col-12 mt-4">
            <DataTable
                :value="templates"
                removableSort
                :paginator="true"
                :rows="10"
                :loading="loading"
                stripedRows
                class="p-datatable-sm"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                :rowsPerPageOptions="[10, 20, 50]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                dataKey="id"
                v-model:selection="selectedRow"
                selectionMode="single"
                @row-click="openTemplate"
            >
                <Column
                    field="title"
                    header="Title"
                    :sortable="true"
                    style="width: 50%"
                ></Column>
                <Column
                    field="sub_title"
                    header="Subtitle"
                    style="width: 50%"
                >
                </Column>
                <!-- <template #paginatorstart>
                    <Button icon="pi pi-refresh" class="p-button-text" :loading="loading" @click="getPocs"/>
                </template>
                <template #paginatorend>
                    <Button icon="pi pi-cloud" class="p-button-text" />
                </template> -->
            </DataTable>
        </div>
    </div>
</template>

<script lang="ts">
import router from '@/router'
import { TemplateService } from '@/api/ContractService'
import type { Template } from '@/types/ContractData.type'
import { defineComponent, nextTick, ref } from 'vue'

import Button from 'primevue/button'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'

import { useToast } from 'primevue/usetoast'

export default defineComponent({
    name: 'TemplateList',

    components: {
        Button,
        DataTable,
        Column,
    },

    setup(props) {
        const selectedRow = ref({} as Template)
        const loading = ref(false)
        const toast = useToast()
        
        const templates = ref([] as Template[])
        function getTemplates() {
            loading.value = true
            TemplateService.list()
                .then((res) => {
                    templates.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Templates', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Loading Templates',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                })
        }
        getTemplates()
        

        function openTemplate() {
            nextTick(() => {
                router.push({
                    name: 'template-content',
                    params: {
                        template_id: selectedRow.value.id.toString(),
                    },
                })
            })
            
        }

        function newTemplate() {
            router.push({
                name: 'template-create',
            })
        }

        return {
            loading,
            selectedRow,
            templates,
            openTemplate,
            newTemplate,
        }
    }
})
</script>

<style lang="scss" scoped>
.templates-table {
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