<template>
    <v-main class="contract-content-wrapper">
        <LoadingScreen v-if="loading"></LoadingScreen>
        <template v-else-if="!edit">
            <v-row class="justify-center" :no-gutters="true">
                <v-col cols="11">
                    <v-card class="px-8 py-5 my-5" elevation="2">
                        <v-row class="justify-space-between">
                            <v-col cols="8">
                                <h5 class="text-h5">{{ taskData.title }}</h5>
                                <p class="text-subtitle-1">
                                    {{
                                        taskData.sub_title
                                            ? taskData.sub_title
                                            : '-'
                                    }}
                                </p>
                            </v-col>
                            <v-col cols="4" class="d-flex justify-end align-center">
                                <StatusIcon
                                    :status="taskData.status"
                                    :showTitle="true"
                                ></StatusIcon>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card class="pa-8 my-5" elevation="2">
                        <v-row class="justify-start">
                            <v-col cols="3">
                                <span class="text-caption">
                                    Gate:
                                    <br />
                                </span>
                                <p class="text-box">
                                    {{ taskData.gate || '-' }}
                                </p>
                            </v-col>
                            <v-col cols="3">
                                <span class="text-caption">
                                    Sub-Gate:
                                    <br />
                                </span>
                                <p class="text-box">
                                    {{ taskData.subgate || '-' }}
                                </p>
                            </v-col>
                        </v-row>
                        <v-row class="justify-start">
                            <v-col cols="3">
                                <span class="text-caption">
                                    Palt Planned:
                                    <br />
                                </span>
                                <p class="text-box">
                                    {{ taskData.palt_plan || '-' }}
                                </p>
                            </v-col>
                            <v-col cols="3">
                                <span class="text-caption">
                                    Palt Actual:
                                    <br />
                                </span>
                                <p class="text-box">
                                    <!-- CALCULATE PALT ACTUAL -->
                                    {{ taskData.palt_actual || '-' }}
                                </p>
                            </v-col>
                            <v-col cols="3">
                                <span class="text-caption">
                                    Business Days:
                                    <br />
                                </span>
                                <p class="text-box">
                                    {{ taskData.bus_days || '-' }}
                                </p>
                            </v-col>
                        </v-row>
                        <v-row class="justify-start">
                            <v-col cols="12">
                                <span class="text-caption">
                                    Start Date - End Date
                                    <br />
                                </span>
                                <p class="text-box mb-4">
                                    {{ `${dateString(taskData.start_date)} - ${dateString(taskData.end_date)}` }}
                                </p>
                                <DateRange
                                    :startDate="formatDate(taskData.start_date)"
                                    :endDate="formatDate(taskData.end_date)"
                                ></DateRange>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card class="pa-8 my-5" elevation="2">
                        <v-row class="justify-start align-center">
                            <v-col cols="4">
                                <span class="text-caption">
                                    Point of Contact:
                                    <br />
                                </span>
                                <p class="text-box">
                                    {{ formatPOC(taskData.poc) }}
                                </p>
                            </v-col>
                            <v-col cols="4">
                                <span class="text-caption">
                                    Title:
                                    <br />
                                </span>
                                <p class="text-box">
                                    {{ taskData.poc ? taskData.poc.title.title : '-' }}
                                </p>
                            </v-col>
                            <v-col cols="4" class="text-right" v-if="taskData.poc && taskData.poc.email" >
                                <a class="plain-link" :href="`mailto:${taskData.poc.email}`">
                                    <v-btn icon size="small">
                                        <v-icon size="small" >
                                            mdi-email-edit
                                        </v-icon>
                                        <v-tooltip
                                            activator="parent"
                                            location="bottom"
                                        >Open Email</v-tooltip>
                                    </v-btn>
                                </a>
                                <v-btn icon size="small" class="ml-3" v-clipboard:copy="taskData.poc.email">
                                    <v-icon size="small" >
                                        mdi-content-copy
                                    </v-icon>
                                    <v-tooltip
                                        activator="parent"
                                        location="bottom"
                                    >Copy Email</v-tooltip>
                                </v-btn>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card class="pa-8 my-5" elevation="2">
                        <v-row class="justify-start">
                            <v-col cols="12">
                                <span class="text-caption">
                                    Comments:
                                    <br />
                                </span>
                                <p class="text-box">
                                    {{ taskData.comments || '-' }}
                                </p>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-btn
                v-if="taskData.tasks.length === 0"
                color="primary"
                icon="mdi-pencil"
                size="default"
                class="fab-primary"
                @click.prevent="edit = true"
            ></v-btn>
        </template>
        <template v-else>
            <v-row class="justify-center" :no-gutters="true">
                <v-col cols="11">
                    <v-card class="px-8 py-5 my-5" elevation="2">
                        <v-row class="justify-space-between">
                            <v-col cols="8">
                                <h5 class="text-h5">{{ taskData.title }}</h5>
                                <p class="text-subtitle-1">
                                    {{
                                        taskData.sub_title
                                            ? taskData.sub_title
                                            : '-'
                                    }}
                                </p>
                            </v-col>
                            <v-col cols="4" class="d-flex justify-end align-center">
                                <StatusIcon
                                    :status="taskData.status"
                                ></StatusIcon>
                                <v-select
                                    :items="statusTypes"
                                    color="primary"
                                    label="Task Status"
                                    v-model="taskData.status"
                                    hide-details
                                    class="pl-3"
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card class="pa-8 my-5" elevation="2">
                        <v-row class="justify-start">
                            <v-col cols="3">
                                <v-select
                                    color="primary"
                                    label="Gate"
                                    v-model="taskData.gate"
                                    :disabled="true"
                                    hide-details
                                ></v-select>
                            </v-col>
                            <v-col cols="3">
                                <v-select
                                    color="primary"
                                    label="Sub Gate"
                                    v-model="taskData.subgate"
                                    :disabled="true"
                                    hide-details
                                ></v-select>
                            </v-col>
                        </v-row>
                        <v-row class="justify-start">
                            <v-col cols="3">
                                <v-text-field
                                    color="primary"
                                    label="Palt Planned"
                                    v-model="taskData.palt_plan"
                                    :disabled="true"
                                    hide-details
                                ></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                    color="primary"
                                    label="Palt Actual"
                                    v-model="taskData.palt_actual"
                                    :disabled="true"
                                    hide-details
                                ></v-text-field>
                            </v-col>
                            <v-col cols="3">
                                <v-text-field
                                    color="primary"
                                    label="Business Days"
                                    v-model="taskData.bus_days"
                                    type="number"
                                    @change="formatData('bus_days')"
                                ></v-text-field>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card class="pa-8 my-5" elevation="2">
                        <v-row class="justify-start">
                            <v-col cols="12">
                                <v-select
                                    :items="fPocs"
                                    item-value="id"
                                    item-title="fpoc"
                                    color="primary"
                                    label="Point of Contact"
                                    :return-object="true"
                                    v-model="taskData.poc"
                                    hide-details
                                ></v-select>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card class="pa-8 my-5" elevation="2">
                        <v-row class="justify-start">
                            <v-col cols="12">
                                <v-textarea
                                    color="primary"
                                    label="Comments"
                                    auto-grow
                                    outlined
                                    rows="3"
                                    row-height="25"
                                    shaped
                                    v-model="taskData.comments"
                                    hide-details
                                ></v-textarea>
                            </v-col>
                        </v-row>
                    </v-card>
                </v-col>
            </v-row>
            <v-btn
                color="success"
                icon="mdi-check"
                size="default"
                class="fab-primary"
                @click.prevent="save()"
            ></v-btn>
            <v-btn
                color="error"
                icon="mdi-close"
                size="small"
                class="fab-secondary"
                @click.prevent="cancel()"
            ></v-btn>
        </template>
    </v-main>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import type { Task, Contract, PointOfContact, SimpleTask, StatusType } from '@/types/ContractData.type'
import { TaskService } from '@/api/ContractService'
import DateRange from '@/components/DateRange.vue'
import { formatDate, dateString, formatPOC, formatUpdateTask } from '@/composables/ContractCalcs.composable'

import StatusIcon from '@/components/StatusIcon.vue'
import LoadingScreen from '@/components/LoadingScreen.vue'

export default defineComponent({
    name: 'TaskContent',

    components: {
        StatusIcon,
        DateRange,
        LoadingScreen,
    },

    props: {
        simpleTask: {
            type: Object as PropType<SimpleTask>,
            required: true,
        },
        contract: {
            type: Object as PropType<Contract>,
            required: true,
        },
    },

    emits: ['refresh_data'],

    setup(props, { emit }) {
        const loading = ref(true)
        const edit = ref(false)
        const taskData = ref({} as Task)

        const statusTypes = [
            {
                title: 'Incomplete',
                value: 'IC',
            },
            {
                title: 'In Progress',
                value: 'IP',
            },
            {
                title: 'Complete',
                value: 'CP',
            },
        ] as { title: string, value: StatusType }[]

        function formatData(dType: string) {
            switch(dType) {
                case 'bus_days':
                    taskData.value.bus_days = Math.round(taskData.value.bus_days.valueOf()*2)/2
                    break
            }
        }

        function fetchTask(id: Number) {
            loading.value = true
            TaskService.get(id)
                .then((res) => {
                    taskData.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Task', err)
                })
                .finally(() => {
                    loading.value = false
                })
        }

        fetchTask(props.simpleTask.id)

        watch(() => props.simpleTask, (nTask: SimpleTask) => {
            let cnfm = true
            if (edit.value) {
                cnfm = false
                if(!confirm('Navigating away from this page will lose any unsaved changes. Do you wish to continue?')){
                    cnfm = false
                }
                else {
                    cnfm = true
                    edit.value = false
                }
            }
            if(cnfm) fetchTask(nTask.id)
        })

        const fPocs = props.contract.pocs.map((poc: PointOfContact) => ({ ...poc, fpoc: formatPOC(poc), }))

        function save() {
            loading.value = true
            const { data }  = formatUpdateTask(taskData.value)
            TaskService.update(data.id, data)
                .then((res) => {
                    edit.value = false
                    emit('refresh_data', res.data)
                    taskData.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Updating Task', err)
                })
                .finally(() => {
                    loading.value = false
                })
        }

        function cancel() {
            TaskService.get(taskData.value.id)
                .then((res) => {
                    edit.value = false
                    taskData.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Task', err)
                })
        }

        return {
            loading, edit, taskData, formatData, statusTypes,
            formatPOC, fPocs,
            formatDate, dateString,
            save, cancel,
        }
    },
})
</script>

<style lang="scss" scoped>
//
</style>
