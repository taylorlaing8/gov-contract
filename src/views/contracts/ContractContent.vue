<template>
    <v-main class="contract-content-wrapper">
        <template v-if="!edit">
            <v-row class="justify-center" :no-gutters="true">
                <v-col cols="11">
                    <v-card theme="light" class="px-8 py-5 my-5" elevation="2">
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
                            <v-col cols="4" class="text-right">
                                <span class="text-caption"
                                    >Task ID: #{{ taskData.id }}</span
                                >
                                <StatusIcon
                                    :status="taskData.status"
                                    :showTitle="true"
                                ></StatusIcon>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card theme="light" class="pa-8 my-5" elevation="2">
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
                                    {{ '-' }}
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
                                    Comments:
                                    <br />
                                </span>
                                <p class="text-box">
                                    {{ taskData.comments }}
                                </p>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card theme="light" class="pa-8 my-5" elevation="2">
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
                </v-col>
            </v-row>
            <v-btn
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
                    <v-card theme="light" class="px-8 py-5 my-5" elevation="2">
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
                            <v-col cols="4" class="text-right">
                                <span class="text-caption"
                                    >Task ID: #{{ taskData.id }}</span
                                >
                                <div class="d-flex align-center">
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
                                </div>
                            </v-col>
                        </v-row>
                    </v-card>
                    <v-card theme="light" class="pa-8 my-5" elevation="2">
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
                                ></v-text-field>
                            </v-col>
                        </v-row>
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
                    <v-card theme="light" class="pa-8 my-5" elevation="2">
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
import type { Task, Contract, PointOfContact } from '@/types/ContractData.type'

import StatusIcon from '@/components/StatusIcon.vue'

export default defineComponent({
    name: 'ContractContent',

    components: {
        StatusIcon,
    },

    props: {
        task: {
            type: Object as PropType<Task>,
            required: true,
        },
        contract: {
            type: Object as PropType<Contract>,
            required: true,
        },
    },

    setup(props) {
        const edit = ref(false)

        console.log(props.task.start_date?.toJSON)

        const taskData = ref({...props.task})

        const statusTypes = ['IC', 'IP', 'CP']

        watch(() => props.task, (nTask: Task) => {
            if (edit.value) {
                alert('Navigating away from this page will lose any unsaved changes.')
                edit.value = false
            }
            taskData.value = nTask
        })

        function formatPOC(poc: PointOfContact | null) {
            if (poc !== null) {
                return `${poc.prefix}. ${poc.first_name} ${poc.last_name}`
            }
            else return '-'
        }
        const fPocs = props.contract.pocs.map((poc: PointOfContact) => {
            return {
                ...poc,
                fpoc: formatPOC(poc),
            }
        })

        function save() {
            // SAVE LOGIC HERE
            edit.value = false
        }

        function cancel() {
            location.reload()
        }

        return {
            edit,
            taskData,
            statusTypes,
            formatPOC,
            fPocs,
            save,
            cancel,
        }
    },
})
</script>

<style lang="scss" scoped>
//
</style>
