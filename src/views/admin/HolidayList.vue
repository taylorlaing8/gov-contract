<template>
    <div class="contract-content-wrapper">
        <v-row class="justify-center" :no-gutters="true">
            <v-col cols="11">
                <v-card class="px-8 py-5 my-5" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <h5 class="text-h5">Holidays</h5>
                        </v-col>
                    </v-row>
                </v-card>
                <Calendar
                    :columns="4"
                    :rows="1"
                    :is-expanded="true"
                    :attributes="calHolidays"
                ></Calendar>
                <v-card
                    class="px-8 py-5 my-5"
                    elevation="2"
                >
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <table>
                                <thead>
                                    <tr>
                                        <th class="text-left">Holiday</th>
                                        <th class="text-left">Details</th>
                                        <th class="text-left">Date</th>
                                        <th class="text-left">Observed</th>
                                        <th class="text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template
                                        v-for="(holiday, idx) in holidays"
                                        :key="holiday.id"
                                    >
                                        <tr v-if="edit.includes(holiday.id)" >
                                            <td>
                                                <v-text-field
                                                    color="primary"
                                                    label="Title"
                                                    variant="outlined"
                                                    density="compact"
                                                    :hide-details="true"
                                                    v-model="holiday.title"
                                                ></v-text-field>
                                            </td>
                                            <td>
                                                <v-text-field
                                                    color="primary"
                                                    label="Details"
                                                    variant="outlined"
                                                    density="compact"
                                                    :hide-details="true"
                                                    v-model="holiday.details"
                                                ></v-text-field>
                                            </td>
                                            <td>
                                                <DatePicker v-model="holiday.date">
                                                    <template v-slot="{ inputValue, inputEvents }">
                                                        <v-text-field
                                                            color="primary"
                                                            label="Date"
                                                            variant="outlined"
                                                            density="compact"
                                                            :hide-details="true"
                                                            v-model="holiday.date"
                                                            :value="inputValue"
                                                            v-on="inputEvents"
                                                        ></v-text-field>
                                                    </template>
                                                </DatePicker>
                                            </td>
                                            <td>
                                                <DatePicker v-model="holiday.observed">
                                                    <template v-slot="{ inputValue, inputEvents }">
                                                        <v-text-field
                                                            color="primary"
                                                            label="Observed"
                                                            variant="outlined"
                                                            density="compact"
                                                            :hide-details="true"
                                                            v-model="holiday.observed"
                                                            :value="inputValue"
                                                            v-on="inputEvents"
                                                        ></v-text-field>
                                                    </template>
                                                </DatePicker>
                                            </td>
                                            <td class="text-right">
                                                <v-btn
                                                    color="grey"
                                                    icon="mdi-close"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="toggleEdit()"
                                                ></v-btn>
                                                <v-btn
                                                    color="success"
                                                    icon="mdi-check"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="saveHoliday(idx, holiday)"
                                                ></v-btn>
                                            </td>
                                        </tr>
                                        <tr v-else>
                                            <td>{{ holiday.title }}</td>
                                            <td>{{ holiday.details }}</td>
                                            <td>{{ dateString(holiday.date) }}</td>
                                            <td>{{ dateString(holiday.observed) }}</td>
                                            <td class="text-right">
                                                <v-btn
                                                    color="grey"
                                                    icon="mdi-pencil"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="edit.push(holiday.id)"
                                                ></v-btn>
                                                <v-btn
                                                    color="error"
                                                    icon="mdi-delete"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="deleteHoliday(idx, holiday)"
                                                ></v-btn>
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
            @click.prevent="openModal()"
        ></v-btn>
    </div>
    <v-dialog
        v-model="showModal"
        scrollable
        width="auto"
        class="create-modal"
    >
        <v-card class="pa-8 my-5" elevation="2" width="800px" min-height="500px">
            <v-row class="justify-start">
                 <v-col cols="12">
                    <h5 class="text-h5">Create New Holiday</h5>
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
                        v-model="newHoliday.title"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        color="primary"
                        label="Details"
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                        v-model="newHoliday.details"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <DatePicker v-model="newHoliday.date">
                        <template v-slot="{ inputValue, inputEvents }">
                            <v-text-field
                                color="primary"
                                label="Date"
                                variant="outlined"
                                density="compact"
                                :hide-details="true"
                                v-model="newHoliday.date"
                                :value="inputValue"
                                v-on="inputEvents"
                            ></v-text-field>
                        </template>
                    </DatePicker>
                </v-col>
                <v-col cols="6">
                    <DatePicker v-model="newHoliday.observed">
                        <template v-slot="{ inputValue, inputEvents }">
                            <v-text-field
                                color="primary"
                                label="Observed"
                                variant="outlined"
                                density="compact"
                                :hide-details="true"
                                v-model="newHoliday.observed"
                                :value="inputValue"
                                v-on="inputEvents"
                            ></v-text-field>
                        </template>
                    </DatePicker>
                </v-col>
            </v-row>
            <v-spacer></v-spacer>
             <v-row class="text-right">
                <v-col cols="12">
                    <v-btn
                        prepend-icon="mdi-close"
                        label="Save"
                        size="default"
                        variant="flat"
                        @click.prevent="closeModal()"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="success"
                        prepend-icon="mdi-check"
                        label="Save"
                        size="default"
                        variant="flat"
                        @click.prevent="createHoliday(newHoliday)"
                    >
                        Create
                    </v-btn>
                </v-col>
             </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { HolidayService } from '@/api/ContractService'
import type { Holiday } from '@/types/ContractData.type'
import { defineComponent, ref } from 'vue'
import { Calendar } from 'v-calendar'
import { DatePicker } from 'v-calendar'
import { formatDate, dateString } from '@/composables/ContractCalcs.composable'

export default defineComponent({
    name: 'HolidayList',

    components: {
        DatePicker,
        Calendar,
    },

    emits: ['loading-change'],

    setup(props,{ emit }) {
        const edit = ref([])
        const showModal = ref(false)
        const newHoliday = ref({
            title: '',
            details: '',
            date: null,
            observed: null,
        })

        function toggleEdit(type: string, value: number) {
            edit.value.splice(edit.value.findIndex((p) => { return p === value }))
        }

        function openModal() {
            showModal.value = true
        }
        function closeModal() {
            showModal.value = false
            newHoliday.value = {
                title: '',
                details: '',
                date: null,
                observed: null,
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

        emit('loading-change', true)
        const holidays = ref([] as Holiday[])
        HolidayService.list()
            .then((res) => {
                holidays.value = res.data
            })
            .catch((err) => {
                console.warn('Error Fetching Holidays', err)
            })
            .finally(() => {
                holidays.value.forEach(hol => {
                    calHolidays.value.push({
                        highlight: {
                            start: { color: 'red', fillMode: 'solid' },
                            base: { color: 'red', fillMode: 'light' },
                            end: { color: 'red', fillMode: 'solid' },
                        },
                        dates: { start: formatDate(hol.date.toString()), end: formatDate(hol.observed.toString()) },
                        popover: { label: hol.title },
                    })
                })
                emit('loading-change', false)
            })

        function createHoliday(holiday: Holiday) {
            emit('loading-change', true)

            const data: Holiday = {
                ...holiday,
                details: holiday.details && holiday.details !== "" ? holiday.details : null,
            }

            HolidayService.create(data)
                .then((res) => {
                    holidays.value.push(res.data)
                })
                .catch((err) => {
                    console.warn('Error Creating Holiday', err)
                })
                .finally(() => {
                    emit('loading-change', false)
                    closeModal()
                })
        }

        function saveHoliday(idx: number, holiday: Holiday) {
            emit('loading-change', true)
            const editIndex = edit.value.findIndex((h) => h === holiday.id)

            const data: Holiday = {
                ...holiday,
                details: holiday.details && holiday.details !== "" ? holiday.details : null,
            }

            HolidayService.update(holiday.id, data)
                .then((res) => {
                    holidays.value[idx] = res.data
                    edit.value.splice(editIndex, 1)
                })
                .catch((err) => {
                    console.warn('Error Updating Holiday', err)
                })
                .finally(() => {
                    emit('loading-change', false)
                })
        }

        function deleteHoliday(idx: number, holiday: Holiday) {
            emit('loading-change', true)
            const editIndex = edit.value.findIndex((h) => h === holiday.id)

            HolidayService.delete(holiday.id)
                .then((res) => {
                    holidays.value.splice(idx, 1)
                    edit.value.splice(editIndex, 1)
                })
                .catch((err) => {
                    console.warn('Error Deleting Holiday', err)
                })
                .finally(() => {
                    emit('loading-change', false)
                })
        }

        
        return {
            edit, toggleEdit, newHoliday, holidays,
            calHolidays, dateString,
            createHoliday, saveHoliday, deleteHoliday,
            showModal, openModal, closeModal,
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
