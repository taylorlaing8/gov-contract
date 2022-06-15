<template>
    <v-card class="fill-height">
        <v-layout class="fill-height">
            <div class="contract-nav-wrapper">
                <!-- <v-card class="contract-title" :rounded="false">
                    <h4>Contract ID: #{{ $route.params.contract_id }}</h4>
                </v-card> -->
                <div class="contract-title">
                    <router-link :to="`${$route.params.contract_id}`">
                        <h4>Contract ID: #{{ $route.params.contract_id }}</h4>
                    </router-link>
                </div>
                <template v-for="task in contract" :key="task.id">
                    <div
                        class="contract-nav-item"
                        :class="
                            $route.params.task === formatTaskParam(task)
                                ? 'active'
                                : ''
                        "
                        @click="updateActiveTask(task.slug)"
                    >
                        <StatusIcon
                            size="x-small"
                            :status="task.status"
                        ></StatusIcon>
                        <h5 class="contract-nav-title">{{ task.title }}</h5>
                        <v-icon
                            v-if="task.comments"
                            size="x-small"
                            class="pl-3"
                        >
                            mdi-comment-text-outline
                        </v-icon>
                        <v-spacer></v-spacer>
                        <v-icon
                            class="contract-nav-expand"
                            :class="
                                openTasks.indexOf(task.id) >= 0
                                    ? 'expanded'
                                    : ''
                            "
                            v-if="task.tasks"
                            size="x-small"
                            @click.stop="toggleSubtasks(task.id)"
                        >
                            mdi-chevron-down
                        </v-icon>
                    </div>
                    <div class="contract-subtask-wrapper">
                        <div
                            class="contract-subtasks"
                            :class="
                                openTasks.indexOf(task.id) >= 0
                                    ? 'expanded'
                                    : ''
                            "
                        >
                            <div
                                v-for="subtask in task.tasks"
                                :key="subtask.id"
                                class="contract-nav-item subtask"
                                :class="
                                    $route.params.task ===
                                    formatTaskParam(subtask)
                                        ? 'active'
                                        : ''
                                "
                                @click="updateActiveTask(subtask.slug)"
                            >
                                <StatusIcon
                                    size="x-small"
                                    :status="subtask.status"
                                ></StatusIcon>
                                <span class="contract-nav-title">{{
                                    subtask.title
                                }}</span>
                                <v-icon
                                    v-if="subtask.comments"
                                    size="x-small"
                                    class="pl-3"
                                >
                                    mdi-comment-text-outline
                                </v-icon>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
            <template v-if="activeTask">
                <ContractContent
                    :task="activeTask"
                    :contract="contractMeta"
                ></ContractContent>
            </template>
            <template v-else>
                <ContractOverview :contract="contractMeta"></ContractOverview>
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
import ContractOverview from './ContractOverview.vue'
import type { Task } from '@/types/ContractData.type'
import { StatusType } from '@/types/ContractData.type'

import basicContract from './cTemplates/BaseContract'

export default defineComponent({
    name: 'ContractDashboard',

    components: {
        StatusIcon,
        ContractContent,
        ContractOverview,
    },

    setup() {
        const route = useRoute()

        // Call API to load contract meta data
        const contractMeta: Object = {
            id: 21,
            title: 'Overhead Production Services',
            sub_title: '',
            abv: 'ops',
            type: 'Source Selection',
            ucid: 'FA822422R0006', // Unique Contract ID
            status: 'IP',
            pop_date: '', // When current contract ends
            // CALCULATED FIELD
            // arrears: '',                         // How many deliquent days behind the contract is
            gate_one_plan: '',
            gate_two_plan: '',
            gate_three_plan: '',
            gate_four_one_plan: '',
            gate_four_two_plan: '',
            gate_four_three_plan: '',
            gate_four_four_plan: '',
            gate_four_five_plan: '',
            pocs: [
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
            ],
        }

        // Calculate Palt Actual as you loop through tasks that have a start and end date
        const contract = basicContract

        const formatTaskParam = (task: Task) => `${task.id}-${task.slug}`
        const unformatTaskParam = (slug: string) => slug.slice(slug.indexOf('-') + 1)
        watch(
            () => route.params.task,
            (nTask) => {
                if (nTask) {
                    const nTaskFormat = unformatTaskParam(nTask.toString())
                    if (
                        activeTask.value !== null &&
                        activeTask.value.slug !== nTaskFormat
                    )
                        updateActiveTask(nTaskFormat)
                }
            },
        )

        function findTask(slug: string): Task | null {
            let tsk: Task | null = null
            contract.forEach((task) => {
                if (task.slug === slug) tsk = task
                else {
                    if (task.tasks) {
                        const subTask = task.tasks.find((subtask) => {
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
            else
                currTask = findTask(
                    unformatTaskParam(route.params.task.toString()),
                )

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
        if (activeTask.value !== null && activeTask.value.task_id)
            openTasks.value.push(activeTask.value.task_id)

        function toggleSubtasks(id: Number) {
            const idx = openTasks.value.indexOf(id)
            if (idx >= 0) openTasks.value.splice(idx, 1)
            else openTasks.value.push(id)
        }

        return {
            StatusType,
            contract,
            contractMeta,
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
    height: calc(100vh - 60px);
    overflow-x: hidden;
    overflow-y: scroll;
    padding: 0.5rem 0.7rem;

    & .contract-title {
        padding: 1rem 0.75rem;
        margin-bottom: 0.75rem;
        background: linear-gradient(35deg, #1d9fca 30%, #ffffff 100%);
        box-shadow: 0px 3px 1px -2px rgb(0 0 0 / 20%),
            0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
        color: white;
        border-radius: 3px;

        & a {
            text-decoration: none;
            color: inherit;
        }
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
        padding: 0.3rem 0.75rem;
        transition: 0.3s;
        border-radius: 3px;

        &.subtask {
            padding-left: 2rem;
        }

        &.active {
            background-color: #1d9fca15;
            color: #1d9fca;
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
