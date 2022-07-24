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
                contextMenu
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
                    style="width: 45%"
                >
                </Column>
                <Column
                    style="width: 5%"
                >
                    <template #body="slotProps">
                        <Button icon="pi pi-ellipsis-h" class="p-button-rounded p-button-text p-button-sm" @click="openDetailMenu($event, slotProps.data)"/>
                    </template>
                </Column>
                <!-- <template #paginatorstart>
                    <Button icon="pi pi-refresh" class="p-button-text" :loading="loading" @click="getPocs"/>
                </template>
                <template #paginatorend>
                    <Button icon="pi pi-cloud" class="p-button-text" />
                </template> -->
            </DataTable>
            <ContextMenu :model="detailsMenu" ref="dMenu" />
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
import ContextMenu from 'primevue/contextmenu'

import { useToast } from 'primevue/usetoast'
import _ from 'lodash'

export default defineComponent({
    name: 'TemplateList',

    components: {
        Button,
        DataTable,
        Column,
        ContextMenu,
    },

    setup(props) {
        const selectedRow = ref({} as Template)
        const loading = ref(false)
        const toast = useToast()

        const dMenu = ref()
        const detailsMenu = ref([
            { label: 'Edit', icon: 'pi pi-fw pi-pencil', command: () => openTemplate() },
            { label: 'Duplicate', icon: 'pi pi-fw pi-copy', command: () => duplicateTemplate() },
            { separator:true },
            { label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => deleteTemplate() }
        ])

        function openDetailMenu(event, data: Template) {
            selectedRow.value = data
            dMenu.value.show(event)
        }
        
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

        function duplicateTemplate() {
            const data = _.cloneDeep(selectedRow.value)
            const lastNum = Number(data.title.charAt(data.title.length - 1))
            if (!Number.isNaN(lastNum)) data.title = data.title.substring(0, data.title.length - 1) + (lastNum + 1)
            else data.title = data.title + ' 1'
            TemplateService.create(data)
                .then((res) => {
                    templates.value.push(res.data)
                    toast.add({
                        severity: 'success',
                        summary: 'Duplicated',
                        detail: 'Template Successfully Duplicated',
                        life: 3000,
                    })
                })
                .catch((err) => {
                    console.warn('Error Duplicating Template', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Duplicating Template',
                        life: 3000,
                    })
                })
        }

        function deleteTemplate() {
            TemplateService.delete(selectedRow.value.id || 0)
                .then((res) => {
                    const idx = templates.value.findIndex((t) => t.id === selectedRow.value.id)
                    templates.value.splice(idx, 1)
                    toast.add({
                        severity: 'success',
                        summary: 'Deleted',
                        detail: 'Template Successfully Removed',
                        life: 3000,
                    })
                })
                .catch((err) => {
                    console.warn('Error Deleting Template', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Deleting Template',
                        life: 3000,
                    })
                })
        }
        

        function openTemplate() {
            nextTick(() => {
                router.push({
                    name: 'template-content',
                    params: {
                        template_id: selectedRow.value.id?.toString(),
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
            dMenu,
            detailsMenu,
            openDetailMenu,
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