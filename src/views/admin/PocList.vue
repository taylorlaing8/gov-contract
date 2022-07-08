<template>
    <div class="grid align-items-center">
        <div class="col-8">
            <h1>Team Members</h1>
        </div>
        <div class="col-4 text-right">
            <template v-if="selectedRow.id">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-plain header-button ml-2"
                    @click="selectedRow = {}"
                />
                <Button
                    label="Delete"
                    icon="pi pi-trash"
                    class="p-button-danger header-button ml-2"
                    @click="deletePoc"
                />
            </template>
            <template v-else>
                <Button
                    label="Team Member"
                    icon="pi pi-plus"
                    class="p-button-secondary header-button"
                    @click="openModal"
                />
            </template>
        </div>
        <div class="col-12 mt-4">
            <DataTable
                :value="pocs"
                removableSort
                :paginator="true"
                :rows="10"
                :loading="loading"
                stripedRows
                class="p-datatable-sm"
                paginatorTemplate="CurrentPageReport FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink RowsPerPageDropdown"
                :rowsPerPageOptions="[10, 20, 50]"
                currentPageReportTemplate="Showing {first} to {last} of {totalRecords}"
                editMode="row"
                dataKey="id"
                v-model:editingRows="editingRows"
                v-model:selection="selectedRow"
                selectionMode="single"
                @row-edit-save="savePoc($event.index, $event.newData)"
            >
                <Column field="prefix" header="Prefix" :sortable="true">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" autofocus />
                    </template>
                </Column>
                <Column field="first_name" header="First Name" :sortable="true">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" autofocus />
                    </template>
                </Column>
                <Column field="last_name" header="Last Name" :sortable="true">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" autofocus />
                    </template>
                </Column>
                <Column field="email" header="Email" :sortable="true">
                    <template #editor="{ data, field }">
                        <InputText v-model="data[field]" autofocus />
                    </template>
                </Column>
                <Column field="title.title" header="Position" :sortable="true">
                    <template #editor="{ data }">
                        <Dropdown
                            v-model="data['title'].id"
                            :options="positions"
                            optionLabel="title"
                            optionValue="id"
                            placeholder="Select Position"
                        >
                            <template #option="slotProps">
                                <span>{{ slotProps.option.title }}</span>
                            </template>
                        </Dropdown>
                    </template>
                    <template #body="slotProps">
                        {{ formatPosition(slotProps.data) }}
                    </template>
                </Column>
                <Column
                    :rowEditor="true"
                    style="min-width: 8rem"
                    bodyStyle="text-align:center"
                ></Column>
                <!-- <template #paginatorstart>
                    <Button icon="pi pi-refresh" class="p-button-text" :loading="loading" @click="getContracts"/>
                </template>
                <template #paginatorend>
                    <Button icon="pi pi-cloud" class="p-button-text" />
                </template> -->
            </DataTable>
        </div>
        <ConfirmDialog></ConfirmDialog>
        <Dialog
            v-model:visible="showModal"
            :style="{ width: '700px' }"
            header="Add Team Member"
            :modal="true"
            class="p-fluid"
            :closeOnEscape="true"
            :dismissableMask="true"
            :draggable="false"
        >
            <div class="formgrid grid">
                <div class="field col-2">
                    <label for="prefix">Prefix</label>
                    <InputText id="prefix" v-model="newPoc.prefix" />
                </div>
                <div class="field col-5">
                    <label for="first-name">First Name</label>
                    <InputText id="first-name" v-model="newPoc.first_name" />
                </div>
                <div class="field col-5">
                    <label for="last-name">Last Name</label>
                    <InputText id="last-name" v-model="newPoc.last_name" />
                </div>
                <div class="field col-6">
                    <label for="email">Email</label>
                    <InputText id="email" v-model="newPoc.email" />
                </div>
                <div class="field col-6">
                    <label for="title">Title</label>
                    <Dropdown
                        v-model="newPoc.title_id"
                        id="title"
                        :options="positions"
                        optionLabel="title"
                        optionValue="id"
                        placeholder="Select Position"
                    >
                        <template #option="slotProps">
                            <span>{{ slotProps.option.title }}</span>
                        </template>
                    </Dropdown>
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
                    @click="createPoc"
                />
            </template>
        </Dialog>
    </div>
</template>

<script lang="ts">
import { PointOfContactService, PositionService } from '@/api/ContractService'
import type { PointOfContact, Position } from '@/types/ContractData.type'
import { defineComponent, ref } from 'vue'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import Dropdown from 'primevue/dropdown'
import InputText from 'primevue/inputtext'

import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from "primevue/useconfirm"

export default defineComponent({
    name: 'PocList',

    components: {
        Button,
        Dialog,
        DataTable,
        Column,
        Dropdown,
        InputText,
        ConfirmDialog,
    },

    setup(props) {
        const editingRows = ref([])
        const selectedRow = ref({} as PointOfContact)
        const loading = ref(false)
        const toast = useToast()
        const confirm = useConfirm()

        const showModal = ref(false)
        const newPoc = ref({
            first_name: '',
            last_name: '',
            email: '',
            prefix: '',
            title_id: null,
        })

        function openModal() {
            showModal.value = true
        }
        function closeModal() {
            showModal.value = false
            newPoc.value = {
                first_name: '',
                last_name: '',
                email: '',
                prefix: '',
                title_id: null,
            }
        }

        const positions = ref([] as Position[])
        const pocs = ref([] as PointOfContact[])

        async function initData() {
            loading.value = true
            await PositionService.list()
                .then((res) => {
                    positions.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Positions', err)
                })

            await PointOfContactService.list()
                .then((res) => {
                    pocs.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Team Members', err)
                })

            loading.value = false
        }
        initData()

        const formatPosition = (poc: PointOfContact) => poc.title?.title

        function createPoc() {
            loading.value = true
            PointOfContactService.create(newPoc.value)
                .then((res) => {
                    pocs.value.push(res.data)
                    toast.add({
                        severity: 'success',
                        summary: 'Created',
                        detail: 'Team Member Created',
                        life: 3000,
                    })
                })
                .catch((err) => {
                    console.warn('Error Creating Point of Contact', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Creating Team Member',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                    closeModal()
                })
        }

        function savePoc(idx: number, poc: PointOfContact) {
            loading.value = true
            const formatPoc = {
                id: poc.id,
                first_name: poc.first_name,
                last_name: poc.last_name,
                email: poc.email,
                prefix: poc.prefix,
                title_id: poc.title?.id,
            }

            PointOfContactService.update(poc.id, formatPoc)
                .then((res) => {
                    pocs.value[idx] = res.data
                    toast.add({
                        severity: 'success',
                        summary: 'Saved',
                        detail: 'Team Member Data Updated',
                        life: 3000,
                    })
                })
                .catch((err) => {
                    console.warn('Error Updating Point of Contact', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Updating Team Member Data',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                    selectedRow.value = {} as PointOfContact
                })
        }

        function deletePoc() {
            confirm.require({
                message: 'Do you want to delete this team member?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                accept: () => {
                    loading.value = true
                    const idx = pocs.value.findIndex((p) => p.id === selectedRow.value.id)

                    PointOfContactService.delete(selectedRow.value.id)
                        .then((res) => {
                            pocs.value.splice(idx, 1)
                            toast.add({
                                severity: 'success',
                                summary: 'Saved',
                                detail: 'Team Member Deleted',
                                life: 3000,
                            })
                        })
                        .catch((err) => {
                            console.warn('Error Deleting Point of Contact', err)
                            toast.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error Deleting Team Member',
                                life: 3000,
                            })
                        })
                        .finally(() => {
                            loading.value = false
                            selectedRow.value = {} as PointOfContact
                        })
                },
                reject: () => {}
            })
        }

        return {
            loading,
            editingRows,
            selectedRow,
            newPoc,
            pocs,
            positions,
            formatPosition,
            createPoc,
            savePoc,
            deletePoc,
            showModal,
            openModal,
            closeModal,
        }
    },
})
</script>

<style lang="scss" scoped>
//
</style>
