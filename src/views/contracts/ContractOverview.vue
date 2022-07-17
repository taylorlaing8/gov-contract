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
        <div class="grid">
            <div class="col-5 mt-4">
                <h3>Background</h3>
                <table class="contract-summary mt-3">
                    <tr v-for="point in contractSummary" :key="point.key">
                        <td>
                            <p class="text-large">{{ point.title }}</p>
                        </td>
                        <td>
                            <p class="text-large">
                                <span class="border-round bg-secondary text-white ml-3 mr-1 px-3 py-1">
                                    {{ point.value }}
                                </span>
                            </p>
                        </td>
                    </tr>
                </table>
            </div>
            <div class="col-7 mt-4">
                <h3>Contract Status</h3>
                <DataTable :value="contractStatus" class="p-datatable-sm mt-3">
                    <Column
                        field="gate"
                        header="Gate"
                        style="width: 25%"
                    ></Column>
                    <Column
                        field="palt_plan"
                        header="Palt"
                        style="width: 25%"
                    ></Column>
                    <Column
                        field="palt_actual"
                        header="Actual"
                        style="width: 25%"
                    ></Column>
                    <Column
                        field="difference"
                        header="+/-"
                        style="width: 25%"
                    ></Column>
                    <ColumnGroup type="footer">
                        <Row>
                            <Column footer="Total" />
                            <Column :footer="contractStatus.reduce((accumulator, object) => {
                                    return accumulator + object.palt_plan;
                                }, 0)"
                            />
                            <Column :footer="contractStatus.reduce((accumulator, object) => {
                                    return accumulator + object.palt_actual;
                                }, 0)"
                            />
                            <Column :footer="contractStatus.reduce((accumulator, object) => {
                                    return accumulator + object.difference;
                                }, 0)"
                            />
                        </Row>
                    </ColumnGroup>
                </DataTable>
            </div>
        </div>
        <div class="grid">
            <div class="col-4 mt-4">
                <h3 class="mb-3">Upcoming Tasks</h3>
                <Button v-for="task in upcomingTasks" :key="task.id" class="text-sm px-3 w-full text-left p-button-danger p-button-outlined my-1" iconPos="right" :label="getShortString(task.title)" @click="openTask(task)" />
            </div>
            <div class="col-4 mt-4">
                <h3 class="mb-3">In Progress Tasks</h3>
                <Button v-for="task in currentTasks" :key="task.id" class="text-sm px-3 w-full text-left p-button-outlined my-1" iconPos="right" :label="getShortString(task.title)" @click="openTask(task)" />
            </div>
            <div class="col-4 mt-4">
                <h3 class="mb-3">Recently Completed Tasks</h3>
                <Button v-for="task in completedTasks" :key="task.id" class="text-sm px-3 w-full text-left p-button-success p-button-outlined my-1" iconPos="right" :label="getShortString(task.title)" @click="openTask(task)" />
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
import DataTable from 'primevue/datatable'
import Row from 'primevue/row'
import ColumnGroup from 'primevue/columngroup'
import Column from 'primevue/column'

import TaskSkeleton from '@/components/TaskSkeleton.vue'
import { Contract, StatusType, Task } from '@/types/ContractData.type'
import { ContractService } from '@/api/ContractService'
import { useToast } from 'primevue/usetoast'
import router from '@/router'

export default defineComponent({
    name: 'ContractOverview',

    components: {
        StatusIcon,
        Button,
        DataTable,
        Row,
        ColumnGroup,
        Column,
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
                    setContractSummary()
                    setContractStatus()
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

        function setContractSummary() {
            contractSummary.value = [
                {
                    id: 1,
                    title: 'Contract Value',
                    value: `$${contract.value.value} M`,
                },
                {
                    id: 2,
                    title: 'Contract Type',
                    value: contract.value.type,
                },
                {
                    id: 3,
                    title: 'SAA',
                    value: formatPOC(contract.value.ssa),
                },
                {
                    id: 4,
                    title: 'CAA',
                    value: formatPOC(contract.value.caa)
                },
                {
                    id: 5,
                    title: 'SDO',
                    value: formatPOC(contract.value.sdo)
                },
                {
                    id: 6,
                    title: 'Need Date',
                    value: dateString(formatDate(contract.value.need_date.toString()))
                },
                {
                    id: 7,
                    title: 'Award Date',
                    value: dateString(formatDate(contract.value.award_date.toString()))
                }
            ]
        }

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
            })
            
            contractStatus.value = [ gateOne, gateTwo, gateThree, gateFour ]
        }

        const upcomingTasks = ref([] as Task[])
        const currentTasks = ref([] as Task[])
        const completedTasks = ref([] as Task[])
        function filterTasks() {
            props.tasks.forEach((task) => {
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
            ).splice(5)
            completedTasks.value.sort(
                (tskA, tskB) => new Date(tskB.status_updated).getTime() - new Date(tskA.status_updated).getTime()
            ).splice(5)
            upcomingTasks.value.splice(5)
        }
        filterTasks()
        
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
</style>
