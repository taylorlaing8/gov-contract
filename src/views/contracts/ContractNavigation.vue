<template>
    <div class="loading" v-if="loading">
        <ProgressSpinner />
    </div>
    <div class="flex" v-if="!loading">
        <div class="contract-nav-wrapper">
            <div class="contract-title shadow-2" @click="openOverview">
                <!-- <router-link :to="`/contracts/${contract.id.toString()}`"> -->
                <h4>Contract ID: {{ contract.ucid }}</h4>
                <!-- </router-link> -->
            </div>
            <div
                class="contract-nav-item-wrapper"
                v-if="contract.tasks.length > 0"
            >
                <template v-for="task in contract.tasks" :key="task.id">
                    <div
                        class="contract-nav-item"
                        :class="
                            $route.params.task === formatTaskParam(task)
                                ? 'active'
                                : ''
                        "
                        @click="openTask(task)"
                    >
                        <StatusIcon :status="task.status"></StatusIcon>
                        <h5 class="contract-nav-title">{{ task.title }}</h5>
                        <i v-if="task.comments" class="pl-3 pi pi-comment"></i>
                        <span class="flex-auto"></span>
                        <i
                            v-if="task.tasks.length > 0"
                            class="contract-nav-expand pi pi-angle-down"
                            :class="
                                openTasks.indexOf(task.id) >= 0
                                    ? 'expanded'
                                    : ''
                            "
                            @click.stop="toggleSubtasks(task.id)"
                        ></i>
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
                                @click="openTask(subtask)"
                            >
                                <StatusIcon :status="subtask.status"></StatusIcon>
                                <h5 class="contract-nav-title">
                                    {{ subtask.title }}
                                </h5>
                                <div class="flex-auto"></div>
                                <i
                                    v-if="subtask.comments"
                                    class="pl-3 pi pi-comment"
                                ></i>
                            </div>
                        </div>
                    </div>
                </template>
            </div>
        </div>
        <div class="contract-content-wrapper grid justify-content-center w-full p-3" :class="`status-bg-${currentStatus}`">
            <router-view :pocs="contract.pocs" :tasks="contract.tasks" @refresh_data="refreshTaskData" @get_status="getStatus"></router-view>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, Ref, watch } from 'vue'
import router from '@/router'
import { useRoute } from 'vue-router'
import { useToast } from 'primevue/usetoast'
import StatusIcon from '@/components/StatusIcon.vue'
import ProgressSpinner from 'primevue/progressspinner'
import type { SimpleContract, SimpleTask } from '@/types/ContractData.type'
import { StatusType } from '@/types/ContractData.type'
import { ContractService } from '@/api/ContractService'
import { formatTaskParam, unformatTaskParam } from '@/composables/ContractCalcs.composable'

export default defineComponent({
    name: 'ContractNavigation',

    components: {
        StatusIcon,
        ProgressSpinner,
    },

    props: {
        contract_id: {
            type: Number,
            required: true,
        },
    },

    setup(props) {
        const route = useRoute()
        const loading = ref(true)
        const toast = useToast()
        const contract = ref({} as SimpleContract)
        const openTasks: Ref<Number[]> = ref([])

        function findTask(taskId: number): SimpleTask | null {
            let tsk: SimpleTask | null = null
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

        function openTask(task: SimpleTask) {
            router.push({
                name: 'contract-task-detail',
                params: {
                    task: formatTaskParam(task),
                    // task: null,
                },
            })
            getStatus(task.status as StatusType)
        }

        function openOverview() {
            router.push({
                name: 'contract-overview',
            })
            getStatus(contract.value.status as StatusType)
        }

        function refreshTaskData(task: SimpleTask) {
            if (task.task_id) {
                const idx = contract.value.tasks.map(tsk => tsk.id).indexOf(task.task_id)
                const status = ref(task.status as StatusType)

                contract.value.tasks[idx].tasks?.forEach(tsk => {
                    if (tsk.id === task.id) {
                        if (tsk.status !== task.status) tsk.status = task.status
                        tsk.comments = task.comments
                    }

                    if (status.value != tsk.status && tsk.status != StatusType.COMPLETE) {
                        if (status.value != StatusType.INPROGRESS) status.value = tsk.status as StatusType
                    }
                })

                contract.value.tasks[idx].status = status.value
            }
            else {
                const idx = contract.value.tasks.map(tsk => tsk.id).indexOf(task.id)
                if(contract.value.tasks[idx].status !== task.status) contract.value.tasks[idx].status = task.status
                contract.value.tasks[idx].comments = task.comments
            }
        }

        const currentStatus = ref('IC' as StatusType)
        function getStatus(status: StatusType) {
            currentStatus.value = status
        }

        function getContract() {
            loading.value = true

            ContractService.getOverview(props.contract_id)
                .then((res) => {
                    contract.value = res.data
                    getStatus(contract.value.status as StatusType)
                })
                .then(() => {
                    if (route.params.task) {
                        const task = findTask(unformatTaskParam(route.params.task.toString()))
                        if (task && task.task_id) toggleSubtasks(task.task_id)
                    }
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
                    loading.value = false
                })
        }
        getContract()

        watch(
            () => route.params.task?.toString(),
            (nTask: String) => {
                if (route.params.task) {
                    const task = findTask(unformatTaskParam(route.params.task.toString()))
                    if (task && task.task_id) {
                        const idx = openTasks.value.indexOf(task.task_id)
                        if (idx < 0) openTasks.value.push(task.task_id)
                    }
                }
            },
        )

        function toggleSubtasks(id: Number) {
            const idx = openTasks.value.indexOf(id)
            if (idx >= 0) openTasks.value.splice(idx, 1)
            else openTasks.value.push(id)
        }

        return {
            StatusType,
            loading,
            contract,
            refreshTaskData,
            currentStatus,
            getStatus,
            openOverview,
            formatTaskParam,
            openTask,
            openTasks,
            toggleSubtasks,
        }
    },
})
</script>

<style lang="scss" scoped>
.loading {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
}

.contract-nav-wrapper {
    width: 350px;
    min-width: 350px;
    height: calc(100vh - 75.5px);
    overflow-x: hidden;
    overflow-y: scroll;

    & .contract-title {
        padding: 1rem 0.75rem;
        background-color: $dark-grey;
        position: absolute;
        width: 350px;
        min-width: 350px;

        & h4 {
            color: white;
        }

        &:hover {
            cursor: pointer;
        }
    }

    & .contract-nav-item-wrapper {
        padding: 4rem 0.5rem 0.5rem;
        min-height: 100%;
        background: $med-grey;

        & .contract-nav-expand {
            transition: all 0.3s;
            padding: 0rem 0.5rem;

            &.expanded {
                transform: rotateX(180deg);
            }
        }

        & .contract-subtask-wrapper {
            overflow: hidden;

            & .contract-subtasks {
                margin-bottom: -200%;
                transition: all 0.4s;

                &.expanded {
                    margin: auto auto 0px 10px;
                    background: $med-grey;
                    border-left: 3px solid $primary-color;
                }
            }
        }

        & .contract-nav-item {
            display: flex;
            align-items: center;
            padding: 0.5rem 0.75rem;
            margin: 4px;
            border-radius: 3px;
            background: white;
            transition: 0.3s;

            &.subtask {
                margin-left: 10px;

                & .contract-nav-title {
                    padding-left: 8px;
                    font-size: 10pt;
                    font-weight: 400;
                }

                &.active > h5 {
                    color: $warning;
                }
            }

            &.active > h5 {
                color: $warning;
            }

            & .contract-nav-title {
                padding-left: 8px;
                font-size: 10pt;
                font-weight: 500;
            }

            &:hover {
                cursor: pointer;
                background-color: $light-grey;
            }
        }
    }
}
.contract-content-wrapper {
    height: calc(100vh - 75.5px);
    overflow-x: hidden;
    overflow-y: scroll;
    background: white;

    &.status-bg-IC {
        background: linear-gradient(0deg, $light-grey 50%, $error-lighten-1 100%);
    }
    &.status-bg-IP {
        background: linear-gradient(0deg, $light-grey 50%, $info-lighten-1 100%);
    }
    &.status-bg-CP {
        background: linear-gradient(0deg, $light-grey 50%, $success-lighten-1 100%);
    }
}
</style>
