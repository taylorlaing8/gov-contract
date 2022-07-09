<template>
    <div class="grid align-items-center">
        <div class="col-8">
            <h1>Positions</h1>
        </div>
        <div class="col-4 text-right">
            <Button
                label="Position"
                icon="pi pi-plus"
                class="p-button-secondary header-button"
                @click="openModal"
            />
        </div>
        <div class="col-12 mt-4">
            <DataTable
                :value="positions"
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
                @row-click="openEditModal"
            >
                <Column
                    field="title"
                    header="Title"
                    :sortable="true"
                    style="width: 50%"
                ></Column>
                <Column
                    field="department"
                    header="Department"
                    :sortable="true"
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
        <ConfirmDialog></ConfirmDialog>
        <Dialog
            v-model:visible="showEditModal"
            :style="{ width: '700px' }"
            header="Edit Position"
            :modal="true"
            class="p-fluid"
            :closeOnEscape="true"
            :dismissableMask="true"
            :draggable="false"
            @hide="selectedRow = {}"
        >
            <div class="formgrid grid">
                <div class="field col-6">
                    <label for="title">Title</label>
                    <InputText id="title" v-model="selectedRow.title" />
                </div>
                <div class="field col-6">
                    <label for="department">department</label>
                    <InputText id="department" v-model="selectedRow.department" />
                </div>
            </div>
            <template #footer>
                <div class="flex">
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        class="p-button-danger"
                        @click="deletePosition"
                    />
                    <span class="flex-auto"></span>
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        class="p-button-text"
                        @click="closeEditModal"
                    />
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        class="p-button-success"
                        @click="savePosition"
                    />
                </div>
            </template>
        </Dialog>
        <Dialog
            v-model:visible="showModal"
            :style="{ width: '700px' }"
            header="Add Position"
            :modal="true"
            class="p-fluid"
            :closeOnEscape="true"
            :dismissableMask="true"
            :draggable="false"
        >
            <div class="formgrid grid">
                <div class="field col-6">
                    <label for="title">Title</label>
                    <InputText id="title" v-model="newPosition.title" />
                </div>
                <div class="field col-6">
                    <label for="department">Department</label>
                    <InputText id="department" v-model="newPosition.department" />
                </div>
            </div>
            <template #footer>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="closeModal"
                />
                <Button
                    label="Save"
                    icon="pi pi-check"
                    class="p-button-success"
                    @click="createPosition"
                />
            </template>
        </Dialog>
    </div>
</template>

<script lang="ts">
import { PositionService } from '@/api/ContractService'
import type { Position, PositionBuild } from '@/types/ContractData.type'
import { defineComponent, ref } from 'vue'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'

import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

export default defineComponent({
    name: 'PositionsList',

    components: {
        Button,
        Dialog,
        DataTable,
        Column,
        InputText,
        ConfirmDialog,
    },

    setup(props) {
        const selectedRow = ref({} as Position)
        const loading = ref(false)
        const toast = useToast()
        const confirm = useConfirm()

        const showModal = ref(false)
        const newPosition = ref({
            title: '',
            department: '',
        } as PositionBuild)

        function openModal() {
            showModal.value = true
        }
        function closeModal() {
            showModal.value = false
            newPosition.value = {
                title: '',
                department: '',
            }
        }

        const showEditModal = ref(false)
        function openEditModal() {
            showEditModal.value = true
        }
        function closeEditModal() {
            showEditModal.value = false
            selectedRow.value = {} as Position
        }

        const positions = ref([] as Position[])
        function getPositions() {
            loading.value = true
            PositionService.list()
                .then((res) => {
                    positions.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Positions', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Loading Positions',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                })
        }
        getPositions()

        function createPosition() {
            loading.value = true
            PositionService.create(newPosition.value)
                .then((res) => {
                    positions.value.push(res.data)
                    toast.add({
                        severity: 'success',
                        summary: 'Created',
                        detail: 'Position Created',
                        life: 3000,
                    })
                })
                .catch((err) => {
                    console.warn('Error Creating Position', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Creating Position',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                    closeModal()
                })
        }

        function savePosition() {
            const idx = positions.value.findIndex(
                (p) => p.id === selectedRow.value.id,
            )
            loading.value = true

            const formatPosition = {
                id: selectedRow.value.id,
                title: selectedRow.value.title,
                department: selectedRow.value.department,
            }

            PositionService.update(formatPosition.id, formatPosition)
                .then((res) => {
                    positions.value[idx] = res.data
                    toast.add({
                        severity: 'success',
                        summary: 'Saved',
                        detail: 'Position Updated',
                        life: 3000,
                    })
                })
                .catch((err) => {
                    console.warn('Error Updating Position', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Updating Position',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                    selectedRow.value = {} as Position
                    showEditModal.value = false
                })
        }

        function deletePosition() {
            confirm.require({
                message: 'Do you want to delete this position?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                accept: () => {
                    loading.value = true
                    const idx = positions.value.findIndex(
                        (p) => p.id === selectedRow.value.id,
                    )

                    PositionService.delete(selectedRow.value.id)
                        .then((res) => {
                            positions.value.splice(idx, 1)
                            toast.add({
                                severity: 'success',
                                summary: 'Saved',
                                detail: 'Position Deleted',
                                life: 3000,
                            })
                        })
                        .catch((err) => {
                            console.warn('Error Deleting Position', err)
                            toast.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error Deleting Position',
                                life: 3000,
                            })
                        })
                        .finally(() => {
                            loading.value = false
                            closeEditModal()
                        })
                },
                reject: () => {},
            })
        }

        
        return {
            loading,
            selectedRow,
            newPosition,
            positions,
            getPositions,
            createPosition,
            savePosition,
            deletePosition,
            showModal,
            showEditModal,
            openModal,
            openEditModal,
            closeModal,
            closeEditModal,
        }
    }
})
</script>

<style lang="scss" scoped>
//
</style>
