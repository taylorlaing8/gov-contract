<template>
    <v-card class="fill-height">
        <v-layout class="fill-height">
            <div class="contract-nav-wrapper">
                <div class="contract-title">
                    <v-btn size="x-small" variant="contained-text" @click="updateActiveTask(null)">Contract ID: #{{$route.params.contract_id}}</v-btn>
                </div>
                <template v-for="task in contract" :key="task.id">
                    <div
                        class="contract-nav-item"
                        :class="$route.params.task === `${task.id}-${task.slug}` ? 'active' : ''"
                        @click="updateActiveTask(task)"
                    >
                        <StatusIcon size="x-small" :status="task.status"></StatusIcon>
                        <span class="contract-nav-title">{{task.title}}</span>
                    </div>
                    <template v-if="task.data.tasks">
                        <div
                            v-for="subtask in task.data.tasks"
                            :key="subtask.id"
                            class="contract-nav-item subtask"
                            :class="$route.params.task === `${subtask.id}-${subtask.slug}` ? 'active' : ''"
                            @click="updateActiveTask(subtask)"
                        >
                            <StatusIcon size="x-small" :status="subtask.status"></StatusIcon>
                            <span class="contract-nav-title">{{subtask.title}}</span>
                        </div>
                    </template>
                </template>
            </div>
            <!-- <v-navigation-drawer theme="light" permanent width="400">
                <v-list nav>
                    <v-list-item
                        :title="`Contract ID: #${$route.params.contract_id}`"
                        class="pl-4"
                        @click="updateActiveTask(null)"
                    ></v-list-item>

                    <template v-for="task in contract" :key="task.id">
                        <v-list-group
                            v-if="task.data.tasks && task.data.tasks.length > 0"
                            :value="true"
                        >
                            <template v-slot:activator="{ props }">
                                <v-list-item
                                    v-bind="props"
                                    :title="task.title"
                                    :value="task.slug"
                                    active-color="primary"
                                    :variant="
                                        task.status === StatusType.INCOMPLETE
                                            ? 'plain'
                                            : 'text'
                                    "
                                    :active="task.slug === $route.params.task"
                                    @click="updateActiveTask(task)"
                                >
                                    <template v-slot:prepend>
                                        <StatusIcon
                                            :status="task.status"
                                        ></StatusIcon>
                                    </template>
                                </v-list-item>
                            </template>

                            <v-list-item
                                v-for="subtask in task.data.tasks"
                                :key="subtask.id"
                                :value="subtask.slug"
                                :title="subtask.title"
                                active-color="primary"
                                :variant="
                                    subtask.status === StatusType.INCOMPLETE
                                        ? 'plain'
                                        : 'text'
                                "
                                :active="subtask.slug === $route.params.task"
                                @click="updateActiveTask(subtask)"
                            >
                                <template v-slot:prepend>
                                    <StatusIcon
                                        :status="subtask.status"
                                    ></StatusIcon>
                                </template>
                            </v-list-item>
                        </v-list-group>

                        <v-list-item
                            v-else
                            :title="task.title"
                            :value="task.slug"
                            active-color="primary"
                            :variant="
                                task.status === StatusType.INCOMPLETE
                                    ? 'plain'
                                    : 'text'
                            "
                            :active="task.slug === $route.params.task"
                            @click="updateActiveTask(task)"
                        >
                            <template v-slot:prepend>
                                <StatusIcon :status="task.status"></StatusIcon>
                            </template>
                        </v-list-item>
                    </template>
                </v-list>
            </v-navigation-drawer> -->
            <template v-if="activeTask">
                <ContractContent :task="activeTask"></ContractContent>
            </template>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, toRaw } from 'vue'
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

        const navAvailable = contract.find((task) => {
            if (route.params && route.params.task === task.slug) return task
        })

        const activeTask: Ref<Task> | Ref<null> = toRaw(
            ref(navAvailable ? navAvailable : contract[0]),
        )

        function updateActiveTask(task: Task | null) {
            if (task === null) {
                activeTask.value = null
                router.push({
                    name: 'contract',
                    params: {
                        contract_id: route.params.contract_id,
                        task: null,
                    },
                })
                console.log(route.params)
            } else {
                activeTask.value = task
                router.push({
                    name: 'contract',
                    params: {
                        contract_id: route.params.contract_id,
                        task: `${task.id}-${task.slug.toString()}`,
                    },
                })
            }
        }

        return {
            StatusType,
            positions,
            pointsOfContact,
            contract,
            activeTask,
            updateActiveTask,
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

    & .contract-nav-item {
        display: flex;
        align-items: center;
        padding: 0.35rem 2rem;
        transition: 0.3s;

        &.subtask{
            padding-left: 4rem;
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
