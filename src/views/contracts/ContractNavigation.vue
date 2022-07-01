<template>
    <v-card class="fill-height">
        <div v-if="loading">LOADING...</div>
        <div v-else-if="error">{{error}}</div>
        <v-layout class="fill-height" v-else>
            <div class="contract-nav-wrapper">
                <div class="contract-title">
                    <router-link :to="`${$route.params.contract_id}`">
                        <h4>Contract ID: {{ contract.ucid }}</h4>
                    </router-link>
                </div>
                <template v-if="contract.tasks.length > 0">
                    <template v-for="task in contract.tasks" :key="task.id">
                        <div
                            class="contract-nav-item"
                            :class="
                                $route.params.task === formatTaskParam(task)
                                    ? 'active'
                                    : ''
                            "
                            @click="setActiveTask(task.id)"
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
                                v-if="task.tasks.length > 0"
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
                                    @click="setActiveTask(subtask.id)"
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
                </template>
            </div>
            <template v-if="activeTask">
                <TaskContent
                    :task="activeTask"
                    :contract="contract"
                ></TaskContent>
            </template>
            <template v-else>
                <ContractOverview :contract="contract"></ContractOverview>
            </template>
        </v-layout>
    </v-card>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import StatusIcon from '@/components/StatusIcon.vue'
import TaskContent from './TaskContent.vue'
import ContractOverview from './ContractOverview.vue'
import type { Task, Contract } from '@/types/ContractData.type'
import { StatusType } from '@/types/ContractData.type'
import { ContractService } from '@/api/ContractService'

import basicContract from './cTemplates/BaseContract'

export default defineComponent({
    name: 'ContractNavigation',

    components: {
        StatusIcon,
        TaskContent,
        ContractOverview,
    },

    props: {
        contract_id: {
            type: Number,
            required: true
        }
    },

    setup(props) {
        const route = useRoute()
        const loading = ref(true)
        const contract = ref({} as Contract)
        const openTasks: Ref<Number[]> = ref([])
        const error = ref('')

        const formatTaskParam = (task: Task) => `${task.id}-${task.slug}`
        function unformatTaskParam(routeSlug: string): number {
            return parseInt(routeSlug.slice(0, routeSlug.indexOf('-')))
        }
        watch(
            () => route.params.task,
            (nTask) => {
                if (nTask) {
                    const nTaskFormat = unformatTaskParam(nTask.toString())
                    if (
                        activeTask.value !== null &&
                        activeTask.value.id !== nTaskFormat
                    )
                        setActiveTask(nTaskFormat)
                }
            },
        )

        function findTask(taskId: number): Task | null {
            let tsk: Task | null = null
            contract.value.tasks.forEach((task) => {
                if (task.id === taskId) tsk = task
                else {
                    if (task.tasks) {
                        const subTask = task.tasks.find((subtask) => {
                            if (subtask.id === taskId) return task
                        })

                        if (subTask) tsk = subTask
                    }
                }
            })
            return tsk
        }

        const activeTask = ref({} as Task | null)

        function setActiveTask(taskId?: number) {
            let currTask: Task | null = null

            if (taskId) currTask = findTask(taskId)
            else
                currTask = route.params.task ? findTask(unformatTaskParam(route.params.task.toString())) : null

            if (currTask === null) {
                activeTask.value = null
                router.push({
                    name: 'contract-view',
                    params: {
                        contract_id: route.params.contract_id,
                        task: null,
                    },
                })
            } else {
                activeTask.value = currTask
                router.push({
                    name: 'contract-view',
                    params: {
                        contract_id: route.params.contract_id,
                        task: `${currTask.id}-${currTask.slug.toString()}`,
                    },
                })
            }
        }

        ContractService.get(props.contract_id)
            .then((res) => {
                contract.value = res.data
            })
            .catch((err) => {
                console.warn('Error Fetching Contract', err)
                error.value = 'Contract Not Found'
            })
            .finally(() => {
                loading.value = false
                setActiveTask()
                if (activeTask.value !== null && activeTask.value.task_id !== null) {
                    openTasks.value.push(activeTask.value.task_id)
                }
            })

        function toggleSubtasks(id: Number) {
            const idx = openTasks.value.indexOf(id)
            if (idx >= 0) openTasks.value.splice(idx, 1)
            else openTasks.value.push(id)
        }

        return {
            StatusType,
            loading,
            error,
            contract,
            formatTaskParam,
            activeTask,
            setActiveTask,
            openTasks,
            toggleSubtasks,
        }
    },
})
</script>

<style lang="scss" scoped>
.contract-nav-wrapper {
    min-width: 350px;
    width: 350px;
    height: calc(100vh - 60px);
    overflow-x: hidden;
    overflow-y: scroll;

    & .contract-title {
        padding: 1rem 0.75rem;
        margin-bottom: 0.75rem;
        // background: linear-gradient(35deg, #1d9fca 30%, #ffffff 100%);
        background-color: rgb(var(--v-theme-dark-grey));
        box-shadow: 0px 0px 1px -2px rgb(0 0 0 / 20%),
            0px 2px 2px 0px rgb(0 0 0 / 14%), 0px 1px 5px 0px rgb(0 0 0 / 12%);
        color: white;

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

        &.subtask {
            padding-left: 2rem;

            & .contract-nav-title {
                padding-left: 8px;
                font-size: 10pt;
                font-weight: 400;
            }

            &.active {
                background-color: rgb(var(--v-theme-light-grey));
                font-weight: 500;
                color: rgb(var(--v-theme-secondary))
            }
        }

        &.active {
            background-color: rgb(var(--v-theme-light-grey));
            font-weight: 500;
            color: rgb(var(--v-theme-secondary))
        }

        & .contract-nav-title {
            padding-left: 8px;
            font-size: 10pt;
            font-weight: 500;
        }

        &:hover {
            cursor: pointer;
            background-color: rgb(var(--v-theme-grey), 0.5);
        }
    }
}
</style>
