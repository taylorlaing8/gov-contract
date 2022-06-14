<template>
    <v-card class="fill-height">
        <v-layout class="fill-height">
            <div class="contract-nav-wrapper">
                <div class="contract-title">
                    <v-btn size="x-small" variant="contained-text" :to="$route.params.contract_id">Contract ID: #{{$route.params.contract_id}}</v-btn>
                </div>
                <template v-for="task in contract" :key="task.id">
                    <div
                        class="contract-nav-item"
                        :class="$route.params.task === formatTaskParam(task) ? 'active' : ''"
                        @click="updateActiveTask(task.slug)"
                    >
                        <StatusIcon size="x-small" :status="task.status"></StatusIcon>
                        <h5 class="contract-nav-title">{{task.title}}</h5>
                        <span class="contract-nav-spacer"></span>
                        <v-icon class="contract-nav-expand" :class="openTasks.indexOf(task.id) >= 0 ? 'expanded' : ''" v-if="task.data.tasks" size="x-small" @click="toggleSubtasks(task.id)">
                            mdi-chevron-down
                        </v-icon>
                    </div>
                    <div class="contract-subtask-wrapper">
                        <div class="contract-subtasks" :class="openTasks.indexOf(task.id) >= 0 ? 'expanded' : ''">
                            <div
                                v-for="subtask in task.data.tasks"
                                :key="subtask.id"
                                class="contract-nav-item subtask"
                                :class="$route.params.task === formatTaskParam(subtask) ? 'active' : ''"
                                @click="updateActiveTask(subtask.slug)"
                            >
                                <StatusIcon size="x-small" :status="subtask.status"></StatusIcon>
                                <span class="contract-nav-title">{{subtask.title}}</span>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <template v-if="activeTask">
                <ContractContent :task="activeTask"></ContractContent>
            </template>
            <template v-else>
                <div>
                    <h1>Contract Dashboard Overview</h1>
                </div>
            </template>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import StatusIcon from '@/components/StatusIcon.vue'
import ContractContent from './ContractContent.vue'
import type { Task, Position, PointOfContact } from '@/types/ContractData.type'
import { StatusType } from '@/types/ContractData.type'

export default defineComponent({
    name: 'ContractDashboard',

    components: {
        StatusIcon,
        ContractContent,
    },

    setup() {
        const route = useRoute()

        // Call API to load in contract object
        const contractObject: Task[] = [
            {
                id: 101,
                title: 'Identify / Validate Need',
                sub_title: 'Subtitle Text Here',
                slug: 'identify-validate-need',
                status: 'IP',
                task_id: null,
                contract_id: 21,
                order_id: 1,
                data: {
                    id: 98,
                    contract_id: 21,
                    gate: 1,
                    subgate: null,
                    ssp_date: null,
                    comments: null,
                    tasks: [
                        {
                            id: 102,
                            title: 'Identify issues, requirements, needs',
                            sub_title: '',
                            slug: 'identify-issues-requirements-needs',
                            status: 'CP',
                            task_id: 101,
                            contract_id: 21,
                            order_id: 1,
                            data: {
                                id: 99,
                                contract_id: 21,
                                task_id: 102,
                                gate: 1,
                                subgate: null,
                                palt_plan: 5,
                                bus_days: 3,
                                poc: {
                                    id: 12,
                                    first_name: 'Kailey',
                                    last_name: 'Norman',
                                    email: 'kailey.norman@hillbilly.gov',
                                    prefix: 'Ms',
                                    title: {
                                        id: 123,
                                        title: 'SSEB Chairperson / PM',
                                        department:
                                            'Department of Somthing Here',
                                    },
                                },
                                start_date: new Date('2022-11-12'),
                                end_date: new Date('2022-11-18'),
                                ssp_date: new Date('2022-11-20'),
                                comments: 'Some comments about this item here',
                            },
                        },
                        {
                            id: 103,
                            title: 'Establish need and technical review/ dates',
                            sub_title: '',
                            slug: 'establish-need-and-technical-review-dates',
                            status: 'CP',
                            task_id: 101,
                            contract_id: 21,
                            order_id: 2,
                            data: {
                                id: 100,
                                contract_id: 21,
                                task_id: 103,
                                gate: 1,
                                subgate: null,
                                palt_plan: 5,
                                bus_days: 3,
                                poc: {
                                    id: 12,
                                    first_name: 'Kailey',
                                    last_name: 'Norman',
                                    email: 'kailey.norman@hillbilly.gov',
                                    prefix: 'Ms',
                                    title: {
                                        id: 123,
                                        title: 'SSEB Chairperson / PM',
                                        department:
                                            'Department of Somthing Here',
                                    },
                                },
                                start_date: new Date('2022-11-12'),
                                end_date: new Date('2022-11-18'),
                                ssp_date: new Date('2022-11-20'),
                                comments: 'Some comments about this item here',
                            },
                        },
                        {
                            id: 104,
                            title: 'Organic vs. contract',
                            sub_title: '',
                            slug: 'organic-vs-contract',
                            status: 'IP',
                            task_id: 101,
                            contract_id: 21,
                            order_id: 1,
                            data: {
                                id: 101,
                                contract_id: 21,
                                task_id: 104,
                                gate: 1,
                                subgate: null,
                                palt_plan: 5,
                                bus_days: 3,
                                poc: {
                                    id: 12,
                                    first_name: 'Kailey',
                                    last_name: 'Norman',
                                    email: 'kailey.norman@hillbilly.gov',
                                    prefix: 'Ms',
                                    title: {
                                        id: 123,
                                        title: 'SSEB Chairperson / PM',
                                        department:
                                            'Department of Somthing Here',
                                    },
                                },
                                start_date: new Date('2022-11-12'),
                                end_date: new Date('2022-11-18'),
                                ssp_date: new Date('2022-11-20'),
                                comments: 'Some comments about this item here',
                            },
                        },
                    ],
                },
            },
            {
                id: 105,
                title: "Req't Meeting with Stakeholders",
                sub_title: 'Another Subtitle Text Here',
                slug: 'reqt-meeting-with-stakeholders',
                status: 'IC',
                task_id: null,
                contract_id: 21,
                order_id: 2,
                data: {
                    id: 100,
                    contract_id: 21,
                    task_id: 103,
                    gate: 4,
                    subgate: 1,
                    palt_plan: 2,
                    bus_days: 2,
                    poc: {
                        id: 13,
                        first_name: 'Joseph',
                        last_name: 'Laing',
                        email: 'joseph.laing@hillbilly.gov',
                        prefix: 'Mr',
                        title: {
                            id: 124,
                            title: 'Contract Specialist',
                            department: 'Department of Somthing Else',
                        },
                    },
                    start_date: new Date('2022-11-12'),
                    end_date: new Date('2022-11-18'),
                    ssp_date: new Date('2022-11-20'),
                    comments: 'Some comments about this item here',
                },
            },
        ]

        // If user selects EDIT on the task, load in all POCs and Positions
        const pointsOfContact: PointOfContact[] = [
            {
                id: 12,
                first_name: 'Kailey',
                last_name: 'Norman',
                email: 'kailey.norman@hillbilly.gov',
                prefix: 'Ms',
                title: {
                    id: 123,
                    title: 'SSEB Chairperson / PM',
                    department: 'Department of Somthing Here',
                },
            },
            {
                id: 13,
                first_name: 'Joseph',
                last_name: 'Laing',
                email: 'joseph.laing@hillbilly.gov',
                prefix: 'Mr',
                title: {
                    id: 124,
                    title: 'Contract Specialist',
                    department: 'Department of Somthing Else',
                },
            },
        ]

        const positions: Position[] = [
            {
                id: 123,
                title: 'SSEB Chairperson / PM',
                department: 'Department of Somthing Here',
            },
            {
                id: 124,
                title: 'Contract Specialist',
                department: 'Department of Somthing Else',
            },
        ]

        // Calculate Palt Actual as you loop through tasks that have a start and end date
        const contract = contractObject

        const formatTaskParam = (task: Task) => `${task.id}-${task.slug}`
        const unformatTaskParam = (slug: string) => slug.slice(slug.indexOf('-') + 1)
        watch(() => route.params.task, (nTask) => {
            if(nTask) {
                const nTaskFormat = unformatTaskParam(nTask.toString())
                if(activeTask.value !== null && activeTask.value.slug !== nTaskFormat) updateActiveTask(nTaskFormat)
            }
        })
        
        function findTask(slug: string): Task | null {
            let tsk: Task | null = null
            contract.forEach(task => {
                if (task.slug === slug) tsk = task
                else {
                    if('tasks' in task.data) {
                        const subTask = task.data.tasks.find(subtask => {
                            if (subtask.slug === slug) return task
                        })

                        if (subTask) tsk = subTask
                    }
                }
            })
            return tsk
        }

        const activeTask = ref({} as Task | null)

        function updateActiveTask(slug?: string) {
            let currTask: Task | null = null

            if (slug) currTask = findTask(slug)
            else currTask = findTask(unformatTaskParam(route.params.task.toString()))

            if (currTask === null) {
                activeTask.value = null
                router.push({
                    name: 'contract',
                    params: {
                        contract_id: route.params.contract_id,
                        task: null,
                    },
                })
            } else {
                activeTask.value = currTask
                router.push({
                    name: 'contract',
                    params: {
                        contract_id: route.params.contract_id,
                        task: `${currTask.id}-${currTask.slug.toString()}`,
                    },
                })
            }
        }

        updateActiveTask()

        const openTasks: Ref<Number[]> = ref([])
        if (activeTask.value !== null && activeTask.value.task_id) openTasks.value.push(activeTask.value.task_id)

        function toggleSubtasks(id: Number) {
            const idx = openTasks.value.indexOf(id)
            if(idx >= 0) openTasks.value.splice(idx, 1)
            else openTasks.value.push(id)
        }

        return {
            StatusType,
            positions,
            pointsOfContact,
            contract,
            formatTaskParam,
            activeTask,
            updateActiveTask,
            openTasks,
            toggleSubtasks,
        }
    },
})
</script>

<style lang="scss" scoped>
.contract-nav-wrapper {
    width: 400px;
    border-right: 1px solid lightgrey;
    padding: 12px 0px;

    & .contract-title{
        padding: 8px;
        font-weight: 600;
    }

    & .contract-nav-spacer {
        flex: 1
    }

    & .contract-nav-expand {
        transition: all 0.3s;

        &.expanded {
            transform: rotateX(180deg);
        }
    }

    & .contract-subtask-wrapper {
        overflow: hidden;

        & .contract-subtasks {
            margin-bottom: -100%;
            transition: all 0.4s;

            &.expanded {
                margin-bottom: 0;
            }
        }
    }

    & .contract-nav-item {
        display: flex;
        align-items: center;
        padding: 0.3rem 1.75rem;
        transition: 0.3s;

        &.subtask{
            padding-left: 3rem;
        }

        &.active {
            background-color: #1d9fca15;
            color: #1D9FCA;
        }

        & .contract-nav-title {
            padding-left: 8px;
            font-size: 10pt;
            font-weight: 500;
        }

        &:hover {
            cursor: pointer;
            background-color: #efefef;
        }
    }
}
</style>
