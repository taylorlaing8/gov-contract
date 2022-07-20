<template>
    <div v-if="!loading.includes('contract')" class="task-content col-12 px-5 py-4 bg-white border-round">
        <div class="grid align-items-center">
            <div class="col-9">
                <h1>{{ contract.title }}</h1>
                <p class="m-0">{{ contract.sub_title || '-' }}</p>
            </div>
            <div class="col-3 justify-content-end">
                <div class="flex align-items-center justify-content-end -mr-4">
                    <StatusIcon
                        class="mr-4"
                        justify="end"
                        :status="contract.status"
                        :showTitle="true"
                    ></StatusIcon>
                </div>
            </div>
        </div>
        <div class="grid mt-4">
            <div class="col-12">
                <h3>Background</h3>
                <table class="contract-summary mt-3 w-full">
                    <tr>
                        <td>Contract Value</td>
                        <td>
                            <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-1">
                                {{ `$${contract.value} M` }}
                            </span>
                        </td>
                        <td>Contract Type</td>
                        <td>
                            <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-1">
                                {{ contract.type }}
                            </span>
                        </td>
                    </tr>
                    <tr>
                        <td>Need Date</td>
                        <td>
                            <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-1">
                                {{ dateString(formatDate(contract.need_date.toString())) }}
                            </span>
                        </td>
                        <td>Award Date</td>
                        <td>
                            <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-1">
                                {{ dateString(formatDate(contract.award_date)) }}
                            </span>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
        <div class="grid mt-6 align-items-center">
            <div class="col-6">
                <h3>Points of Contact</h3>
                <table class="points-of-contact mt-3 w-full">
                    <tr v-for="(cpoc, idx) in contractPocs" :key="idx">
                        <td>{{ cpoc.title }}</td>
                        <td>
                            <Button class="px-3 w-full text-left p-button-secondary p-button-outlined my-1" icon="pi pi-copy" iconPos="right" :label="formatPOC(cpoc.value)" v-clipboard:copy="cpoc.value.email" @click="copyEmail" />
                        </td>
                    </tr>
                </table>
            </div>
            <div class="col-1"></div>
            <div class="col-5 text-center border-round shadow-2 p-3">
                <h3>Process / Milestone</h3>
                <p class="m-0 text-sm">Cycle Code: {{ getCycleCode() }}</p>
                <table class="contract-status-summary mt-3 w-full h-12rem">
                    <thead>
                        <tr>
                            <td width="25%">
                                Gate
                            </td>
                            <td width="25%">
                                Palt Planned
                            </td>
                            <td width="25%">
                                Palt Actual
                            </td>
                            <td width="25%">
                                <span class="text-green-500">+</span>/<span class="text-red-500">&#8211;</span>
                            </td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr v-for="(point, idx) in contractStatus" :key="idx">
                            <td width="25%">
                                {{ point.gate }}
                            </td>
                            <td width="25%">
                                {{ point.palt_plan }}
                            </td>
                            <td width="25%" :class="point.palt_plan < point.palt_actual ? 'negative' : 'positive'">
                                {{ point.palt_actual }}
                            </td>
                            <td width="25%" :class="point.difference < 0 ? 'negative' : 'positive'">
                                {{ Math.abs(point.difference) }}
                            </td>
                        </tr>
                    </tbody>
                    <tfoot>
                        <tr>
                            <td width="25%">
                                {{ contractStatusTotals.total }}
                            </td>
                            <td width="25%">
                                {{ contractStatusTotals.plan }}
                            </td>
                            <td width="25%" :class="contractStatusTotals.plan < contractStatusTotals.actual ? 'negative' : 'positive'">
                                {{ contractStatusTotals.actual }}
                            </td>
                            <td width="25%" :class="contractStatusTotals.difference < 0 ? 'negative' : 'positive'">
                                {{ Math.abs(contractStatusTotals.difference) }}
                            </td>
                        </tr>
                    </tfoot>
                </table>
            </div>
        </div>
        <div class="grid mt-6">
            <div class="col-4">
                <h3 class="mb-3">Upcoming Tasks <span class="text-sm font-normal ml-2">(2 Weeks)</span></h3>
                <Button v-for="task in upcomingTasks" :key="task.id" class="text-sm px-3 w-full text-left p-button-danger p-button-outlined my-1" icon="pi pi-arrow-up-right" iconPos="right" :label="getShortString(task.title)" @click="openTask(task)" />
            </div>
            <div class="col-4">
                <h3 class="mb-3">In Progress Tasks</h3>
                <Button v-for="task in currentTasks" :key="task.id" class="text-sm px-3 w-full text-left p-button-outlined my-1" icon="pi pi-arrow-up-right" iconPos="right" :label="getShortString(task.title)" @click="openTask(task)" />
            </div>
            <div class="col-4">
                <h3 class="mb-3">Previous <span class="text-sm font-normal ml-2">(2 Weeks)</span></h3>
                <Button v-for="task in completedTasks" :key="task.id" class="text-sm px-3 w-full text-left p-button-success p-button-outlined my-1" icon="pi pi-arrow-up-right" iconPos="right" :label="getShortString(task.title)" @click="openTask(task)" />
            </div>
        </div>
    </div>
    <TaskSkeleton v-else/>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import StatusIcon from '@/components/StatusIcon.vue'
import {
    formatDate,
    dateString,
    formatPOC,
	formatTaskParam,
} from '@/composables/ContractCalcs.composable'

import Button from 'primevue/button'
import TaskSkeleton from '@/components/TaskSkeleton.vue'
import { Contract, PointOfContact, StatusType, Task } from '@/types/ContractData.type'
import { ContractService } from '@/api/ContractService'
import contractCycles from '@/views/contracts/cTemplates/ContractCycles'
import { useToast } from 'primevue/usetoast'
import router from '@/router'
import _ from 'lodash'

export default defineComponent({
    name: 'ContractOverview',

    components: {
        StatusIcon,
        Button,
        TaskSkeleton,
    },

    props: {
        tasks: {
            type: Array as PropType<Task[]>,
            required: true,
        },
        contract_id: {
            type: Number,
            required: true,
        },
    },

    emits: ['get_status'],

    setup(props, { emit }) {
        const loading = ref([] as string[])
        const edit = ref([] as string[])
        const toast = useToast()

        const contractSummary = ref([] as { id: number, title: string, value: string }[])
        const contractStatus = ref([] as { gate: number, palt_plan: number, palt_actual: number, difference: number }[])
        const contractStatusTotals = ref({} as { total: string, plan: number, actual: number, difference: number })

        const contractPocs = ref([] as { title: string, value: PointOfContact}[])

        const contract = ref({} as Contract)
        function getContract(field: string) {
            loading.value.push(field)
            ContractService.get(props.contract_id)
                .then((res) => {
                    contract.value = res.data
                    // toast.add({
                    //     severity: 'info',
                    //     summary: 'Fetched',
                    //     detail: 'Task Data Retrieved',
                    //     life: 3000,
                    // })
                })
                .then(() => {
                    setContractStatus()
                    filterTasks()
                    contractPocs.value = [ 
                        { title: 'SSA', value: contract.value.ssa },
                        { title: 'CAA', value: contract.value.caa },
                        { title: 'SDO', value: contract.value.sdo },
                        { title: 'PCO', value: contract.value.pco },
                        { title: 'Buyer', value: contract.value.buyer },
                        { title: 'Admin PCO', value: contract.value.admin_pco },
                        { title: 'Admin Buyer', value: contract.value.admin_buyer },
                    ]
                })
                .catch((err) => {
                    console.warn('Error Fetching Contract', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Loading Contract',
                        life: 3000,
                    })
                })
                .finally(() => {
                    if (field != 'task') {
                        // edit.value.splice(edit.value.findIndex((e) => { return e === field }), 1)
                        loading.value.splice(loading.value.findIndex((l) => { return l === field }), 1)
                    }
                    emit('get_status', contract.value.status)
                })
        }
        getContract('contract')

        function setContractStatus() {
            let gateOne = {
                gate: 1,
                palt_plan: 0,
                palt_actual: 0,
                difference: 0,
            }
            let gateTwo = {
                gate: 2,
                palt_plan: 0,
                palt_actual: 0,
                difference: 0,
            }
            let gateThree = {
                gate: 3,
                palt_plan: 0,
                palt_actual: 0,
                difference: 0,
            }
            let gateFour = {
                gate: 4,
                palt_plan: 0,
                palt_actual: 0,
                difference: 0,
            }

            let paltPlan = [] as number[]
            let paltActual = [] as number[]

            contract.value.tasks.forEach((task) => {
                if (task.gate == 1) {
                    gateOne.palt_plan += task.palt_plan
                    gateOne.palt_actual += task.palt_actual
                    gateOne.difference += task.palt_plan - task.palt_actual
                }
                else if (task.gate == 2) {
                    gateTwo.palt_plan += task.palt_plan
                    gateTwo.palt_actual += task.palt_actual
                    gateTwo.difference += task.palt_plan - task.palt_actual
                }
                else if (task.gate == 3) {
                    gateThree.palt_plan += task.palt_plan
                    gateThree.palt_actual += task.palt_actual
                    gateThree.difference += task.palt_plan - task.palt_actual
                }
                else {
                    gateFour.palt_plan += task.palt_plan
                    gateFour.palt_actual += task.palt_actual
                    gateFour.difference += task.palt_plan - task.palt_actual
                }
                paltPlan.push(task.palt_plan)
                paltActual.push(task.palt_actual)
            })

            const paltPlanTotal = gateOne.palt_plan + gateTwo.palt_plan + gateThree.palt_plan + gateFour.palt_plan
            const paltActualTotal = gateOne.palt_actual + gateTwo.palt_actual + gateThree.palt_actual + gateFour.palt_actual
            const differenceTotal = gateOne.difference + gateTwo.difference + gateThree.difference + gateFour.difference

            contractStatus.value = [ gateOne, gateTwo, gateThree, gateFour ]
            contractStatusTotals.value = {
                total: 'Total',
                plan: paltPlanTotal,
                actual: paltActualTotal,
                difference: differenceTotal,
            }
        }

        function copyEmail() {
            toast.add({
                severity: 'success',
                summary: 'Copied!',
                detail: `Email copied to clipboard`,
                life: 3000,
            })
        }

        function getCycleCode() {
            let cycleType: string = ''
            let cycleSubtitle: string = ''

            contractCycles.types.forEach((type) => {
                type.value.forEach((value) => {
                    if (value.code == contract.value.cycle_code) {
                        cycleType = type.title
                        cycleSubtitle = value.sub_title
                    }
                })
            })

            return `${contract.value.cycle_code} (${cycleType} ${cycleSubtitle})`
        }

        const upcomingTasks = ref([] as Task[])
        const currentTasks = ref([] as Task[])
        const completedTasks = ref([] as Task[])
        function filterTasks() {
            contract.value.tasks.forEach((task) => {
                if (task.tasks && task.tasks.length > 0) {
                    task.tasks.forEach((subtask) => {
                        if (subtask.status === StatusType.INPROGRESS) {
                            currentTasks.value.push(subtask)
                        }
                        else if (subtask.status === StatusType.COMPLETE) {
                            completedTasks.value.push(subtask)
                        }
                        else {
                            upcomingTasks.value.push(subtask)
                        }
                    })
                }
                else {
                    if (task.status === StatusType.INPROGRESS) {
                        currentTasks.value.push(task)
                    }
                    else if (task.status === StatusType.COMPLETE) {
                        completedTasks.value.push(task)
                    }
                    else {
                        upcomingTasks.value.push(task)
                    }
                }
            })

            
            currentTasks.value.sort(
                (tskA, tskB) => new Date(tskB.status_updated).getTime() - new Date(tskA.status_updated).getTime()
            )

            let compTwoWeeks = null as number|null
            completedTasks.value = completedTasks.value.sort(
                (tskA, tskB) => new Date(tskB.status_updated).getTime() - new Date(tskA.status_updated).getTime()
            ).filter((task) => {
                const taskDate = new Date(task.end_date)

                if (compTwoWeeks === null) {
                    compTwoWeeks = taskDate.setDate(taskDate.getDate() - 14)
                    return true
                }
                else {
                    const taskDateNumber = Number(taskDate)
                    return taskDateNumber >= compTwoWeeks
                }
            }).splice(0, 9)

            let upTwoWeeks = null as number|null
            upcomingTasks.value = upcomingTasks.value.filter((task) => {
                const taskDate = new Date(task.start_date)

                if (upTwoWeeks === null) {
                    upTwoWeeks = taskDate.setDate(taskDate.getDate() + 14)
                    return true
                }
                else {
                    const taskDateNumber = Number(taskDate)
                    return taskDateNumber <= upTwoWeeks
                }
            }).splice(0, 9)
        }
        
        function openTask(data: Task) {
            router.push({
                name: 'contract-task-detail',
                params: {
                    task: formatTaskParam(data),
                    // task: null,
                },
            })
            emit('get_status', data.status)
        }

        function getShortString(text: string) {
            if (text.length > 34) return text.substring(0, 35) + '...'
            else return text
        }

        return {
            loading,
            edit,
            formatPOC,
            formatDate,
            dateString,
            contract,
            contractSummary,
            contractStatus,
            contractStatusTotals,
            copyEmail,
            getCycleCode,
            contractPocs,
            upcomingTasks,
            currentTasks,
            completedTasks,
            openTask,
            getShortString,
        }
    },
})
</script>

<style lang="scss" scoped>
.contract-content-wrapper {
    background-color: rgb(var(--v-theme-primary-lighten-1));
    height: calc(100vh - 60px);
    overflow-y: scroll;
    overflow-x: hidden;
}

.p-datatable {
    border: 0px !important;

    & .p-datatable-thead > tr > th, .p-datatable-tfoot > tr > th {
        border: 0px !important;
        background: none !important;
    }

    & td {
        color: black;
    }
}

.contract-summary {
    td {
        padding: 0.5rem 0rem;
    }
}

.contract-status-summary {
    thead tr, tfoot tr {
        font-weight: 500;
    }

    tbody tr, tfoot tr {
        td.positive {
            color: $success;
        }
        td.negative {
            color: $error;
        }
    }
}

.p-button.p-button-sm {
    height: 1.5rem !important;
    width: 1.5rem !important;
    padding: 0.5rem !important;
}
</style>
