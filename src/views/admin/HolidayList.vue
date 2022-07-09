<template>
    <div class="grid align-items-center">
        <div class="col-8">
            <h1>Holidays</h1>
        </div>
        <div class="col-4 text-right">
            <Button
                label="Holiday"
                icon="pi pi-plus"
                class="p-button-secondary header-button"
                @click="openModal"
            />
        </div>
        <div class="col-12 mt-4">
            <Calendar
                :columns="4"
                :rows="1"
                :is-expanded="true"
                :attributes="calHolidays"
                class="mb-5"
            ></Calendar>
            <DataTable
                :value="holidays"
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
                    header="Holiday"
                    :sortable="true"
                    style="width: 25%"
                ></Column>
                <Column
                    field="details"
                    header="Details"
                    style="width: 35%"
                >
                </Column>
                <Column
                    field="date"
                    header="Date"
                    :sortable="true"
                    style="width: 20%"
                >
                    <template #body="slotProps">
                        {{ dateString(slotProps.data.date) }}
                    </template>
                </Column>
                <Column
                    field="observed"
                    header="Observed"
                    :sortable="true"
                    style="width: 20%"
                >
                    <template #body="slotProps">
                        {{ dateString(slotProps.data.observed) }}
                    </template>
                </Column>
                <!-- <template #paginatorstart>
                    <Button icon="pi pi-refresh" class="p-button-text" :loading="loading" @click="getHolidays"/>
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
            header="Edit Holiday"
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
                    <label for="details">Details</label>
                    <InputText
                        id="details"
                        v-model="selectedRow.details"
                    />
                </div>
                <div class="field col-6">
                    <label for="date">Date</label>
                    <p-calendar id="date" v-model="selectedRow.date" :showIcon="true" />
                </div>
                <div class="field col-6">
                    <label for="observed">Observed</label>
                    <p-calendar id="observed" v-model="selectedRow.observed" :showIcon="true"/>
                </div>
            </div>
            <template #footer>
                <div class="flex">
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        class="p-button-danger"
                        @click="deleteHoliday"
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
                        @click="saveHoliday"
                    />
                </div>
            </template>
        </Dialog>
        <Dialog
            v-model:visible="showModal"
            :style="{ width: '700px' }"
            header="Add Holiday"
            :modal="true"
            class="p-fluid"
            :closeOnEscape="true"
            :dismissableMask="true"
            :draggable="false"
        >
            <div class="formgrid grid">
                <div class="field col-6">
                    <label for="title">Title</label>
                    <InputText id="title" v-model="newHoliday.title" />
                </div>
                <div class="field col-6">
                    <label for="details">Details</label>
                    <InputText id="details" v-model="newHoliday.details" />
                </div>
                <div class="field col-6">
                    <label for="date">Date</label>
                    <p-calendar id="date" v-model="newHoliday.date" :showIcon="true" />
                </div>
                <div class="field col-6">
                    <label for="observed">Observed</label>
                    <p-calendar id="observed" v-model="newHoliday.observed" :showIcon="true"/>
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
                    @click="createHoliday"
                />
            </template>
        </Dialog>
    </div>
</template>

<script lang="ts">
import { HolidayService } from '@/api/ContractService'
import type { Holiday, HolidayBuild } from '@/types/ContractData.type'
import { defineComponent, nextTick, ref } from 'vue'
import { Calendar } from 'v-calendar'
import { formatDate, dateString, ymdDateFormat } from '@/composables/ContractCalcs.composable'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'

import { useToast } from 'primevue/usetoast'
import ConfirmDialog from 'primevue/confirmdialog'
import { useConfirm } from 'primevue/useconfirm'

export default defineComponent({
    name: 'HolidayList',

    components: {
        Calendar,
        Button,
        Dialog,
        DataTable,
        Column,
        InputText,
        ConfirmDialog,
    },

    setup(props) {
        const selectedRow = ref({} as Holiday)
        const loading = ref(false)
        const toast = useToast()
        const confirm = useConfirm()

        const showModal = ref(false)
        const newHoliday = ref({
            title: '',
            details: '',
            date: new Date(),
            observed: new Date(),
        } as HolidayBuild)

        const showEditModal = ref(false)
        function openEditModal() {
            nextTick(() => {
                selectedRow.value = {
                    ...selectedRow.value,
                    date: new Date(selectedRow.value.date.toString()),
                    observed: new Date(selectedRow.value.observed.toString()),
                }
                showEditModal.value = true
            })
            
        }
        function closeEditModal() {
            showEditModal.value = false
            selectedRow.value = {} as Holiday
        }

        function openModal() {
            showModal.value = true
        }
        function closeModal() {
            showModal.value = false
            newHoliday.value = {
                title: '',
                details: '',
                date: new Date(),
                observed: new Date(),
            }
        }

        const calHolidays = ref([
            {
                key: 'today',
                highlight: { fillMode: 'solid' },
                dates: new Date(),
                popover: { label: 'Today' },
            },
        ] as any[])

        const holidays = ref([] as Holiday[])
        function getHolidays() {
            loading.value = true
            HolidayService.list()
                .then((res) => {
                    holidays.value = res.data
                    holidays.value.forEach((holiday) => {
                        holiday.date = formatDate(holiday.date.toString())
                        holiday.observed = formatDate(holiday.observed.toString())
                    })
                })
                .then(() => {
                    holidays.value.forEach(hol => {
                        calHolidays.value.push({
                            highlight: {
                                start: { color: 'red', fillMode: 'solid' },
                                base: { color: 'red', fillMode: 'light' },
                                end: { color: 'red', fillMode: 'solid' },
                            },
                            dates: { start: hol.date, end: hol.observed },
                            popover: { label: hol.title },
                        })
                    })
                })
                .catch((err) => {
                    console.warn('Error Fetching Holidays', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Loading Holidays',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                })
        }
        getHolidays()

        function createHoliday() {
            loading.value = true

            const data: HolidayBuild = {
                title: newHoliday.value.title,
                details: newHoliday.value.details !== "" ? newHoliday.value.details : null,
                date: ymdDateFormat(new Date(newHoliday.value.date.toString())),
                observed: ymdDateFormat(new Date(newHoliday.value.observed.toString())),
            }

            HolidayService.create(data)
                .then((res) => {
                    holidays.value.push({
                        ...res.data,
                        date: formatDate(res.data.date.toString()),
                        observed: formatDate(res.data.observed.toString()),
                    })
                    toast.add({
                        severity: 'success',
                        summary: 'Created',
                        detail: 'Holiday Created',
                        life: 3000,
                    })
                })
                .catch((err) => {
                    console.warn('Error Creating Holiday', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Creating Holiday',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                    closeModal()
                })
        }

        function saveHoliday() {
            const idx = holidays.value.findIndex(
                (h) => h.id === selectedRow.value.id,
            )
            loading.value = true

            const data: Holiday = {
                ...selectedRow.value,
                details: selectedRow.value.details !== "" ? selectedRow.value.details : null,
                date: ymdDateFormat(new Date(selectedRow.value.date.toString())),
                observed: ymdDateFormat(new Date(selectedRow.value.observed.toString())),
            }

            HolidayService.update(data.id, data)
                .then((res) => {
                    holidays.value[idx] = {
                        ...res.data,
                        date: formatDate(res.data.date.toString()),
                        observed: formatDate(res.data.observed.toString()),
                    }
                    toast.add({
                        severity: 'success',
                        summary: 'Saved',
                        detail: 'Holiday Updated',
                        life: 3000,
                    })
                })
                .catch((err) => {
                    console.warn('Error Updating Holiday', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Updating Holiday',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                    selectedRow.value = {} as Holiday
                    showEditModal.value = false
                })
        }

        function deleteHoliday() {
            confirm.require({
                message: 'Do you want to delete this holiday?',
                header: 'Delete Confirmation',
                icon: 'pi pi-info-circle',
                acceptClass: 'p-button-danger',
                accept: () => {
                    loading.value = true
                    const idx = holidays.value.findIndex(
                        (h) => h.id === selectedRow.value.id,
                    )

                    HolidayService.delete(selectedRow.value.id)
                        .then((res) => {
                            holidays.value.splice(idx, 1)
                            toast.add({
                                severity: 'success',
                                summary: 'Saved',
                                detail: 'Holiday Deleted',
                                life: 3000,
                            })
                        })
                        .catch((err) => {
                            console.warn('Error Deleting Holiday', err)
                            toast.add({
                                severity: 'error',
                                summary: 'Error',
                                detail: 'Error Deleting Holiday',
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
            newHoliday,
            holidays,
            calHolidays,
            getHolidays,
            createHoliday,
            saveHoliday,
            deleteHoliday,
            showModal,
            showEditModal,
            dateString,
            openModal,
            openEditModal,
            closeModal,
            closeEditModal,
        }
    }
})
</script>

<style lang="scss" scoped>
.vc-container {
    padding: 10px 0px !important;
    border: 0px !important;
    box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%), 0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%) !important;
}

.create-modal {
    & .v-row {
        flex: 0 1 auto !important;
    }
}
</style>
