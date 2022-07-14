<template>
    <div
        v-if="taskData.id"
        class="task-content col-12 px-5 py-4 bg-white border-round"
        :class="`border-${taskData.status}`"
    >
        <div class="grid align-items-center">
            <div class="col-9">
                <div class="flex align-items-center">
                    <template v-if="!edit.includes('title')">
                        <h2 @click="edit.push('title')">{{ taskData.title }}</h2>
                        <i
                            class="pi pi-pencil hover-edit-btn"
                            @click="edit.push('title')"
                        ></i>
                    </template>
                    <template v-else>
                        <InputText
                            class="p-inputtext-lg w-full"
                            v-model="taskData.title"
                            :autofocus="true"
                        />
                        <template v-if="!loading.includes('title')">
                            <Button
                                icon="pi pi-times"
                                class="p-button-rounded p-button-text"
                                @click="getTask(taskData.id, 'title')"
                            />
                            <Button
                                icon="pi pi-check"
                                class="p-button-rounded p-button-success p-button-text"
                                @click="saveTask('title')"
                            />
                        </template>
                        <template v-else>
                            <i class="pi pi-spin pi-spinner mx-3"></i>
                        </template>
                    </template>
                </div>
                <div class="flex align-items-center">
                    <template v-if="!edit.includes('sub_title')">
                        <p class="m-0" @click="edit.push('sub_title')">{{ taskData.sub_title || '-' }}</p>
                        <i
                            class="pi pi-pencil hover-edit-btn"
                            @click="edit.push('sub_title')"
                        ></i>
                    </template>
                    <template v-else>
                        <InputText
                            class="p-inputtext-sm w-full"
                            v-model="taskData.sub_title"
                            :autofocus="true"
                        />
                        <template v-if="!loading.includes('sub_title')">
                            <Button
                                icon="pi pi-times"
                                class="p-button-rounded p-button-text"
                                @click="getTask(taskData.id, 'sub_title')"
                            />
                            <Button
                                icon="pi pi-check"
                                class="p-button-rounded p-button-success p-button-text"
                                @click="saveTask('sub_title')"
                            />
                        </template>
                        <template v-else>
                            <i class="pi pi-spin pi-spinner mx-3"></i>
                        </template>
                    </template>
                </div>
            </div>
            <div class="col-3 justify-content-end">
                <div class="flex align-items-center justify-content-end -mr-4">
                    <template v-if="taskData.tasks && taskData.tasks.length > 0">
                        <StatusIcon
                            class="mr-4"
                            justify="end"
                            :status="taskData.status"
                            :showTitle="true"
                            @click="cannotEdit('status')"
                        ></StatusIcon>
                    </template>
                    <template v-else>
                        <template v-if="!edit.includes('status')">
                            <StatusIcon
                                justify="end"
                                :status="taskData.status"
                                :showTitle="true"
                                @click="edit.push('status')"
                            ></StatusIcon>
                            <i
                                class="pi pi-pencil hover-edit-btn"
                                @click="edit.push('status')"
                            ></i>
                        </template>
                        <template v-else>
                            <Dropdown
                                v-model="taskData.status"
                                :options="statusTypes"
                                optionLabel="title"
                                optionValue="value"
                                placeholder="Select Status"
                            >
                                <template #value="slotProps">
                                    <StatusIcon
                                        justify="start"
                                        :status="slotProps.value"
                                        :showTitle="true"
                                    ></StatusIcon>
                                </template>
                                <template #option="slotProps">
                                    <StatusIcon
                                        justify="start"
                                        :status="slotProps.option.value"
                                        :showTitle="true"
                                    ></StatusIcon>
                                    <!-- <span>{{ slotProps.option.title }}</span> -->
                                </template>
                            </Dropdown>
                            <template v-if="!loading.includes('status')">
                                <Button
                                    icon="pi pi-times"
                                    class="p-button-rounded p-button-text"
                                    @click="getTask(taskData.id, 'status')"
                                />
                                <Button
                                    icon="pi pi-check"
                                    class="p-button-rounded p-button-success p-button-text"
                                    @click="saveTask('status')"
                                />
                            </template>
                            <template v-else>
                                <i class="pi pi-spin pi-spinner mx-3"></i>
                            </template>
                        </template>
                    </template>
                </div>
            </div>
        </div>
        <div class="grid mt-4 align-items-center">
            <div class="col-4 flex align-items-center">
                <template v-if="taskData.tasks && taskData.tasks.length > 0">
                    <p class="text-large">
                        Business Days
                        <span
                            class="border-round text-white surface-800 ml-3 mr-1 px-3 py-1"
                            @click="cannotEdit('bus_days')"
                        >
                            {{ taskData.bus_days }}
                        </span>
                    </p>
                </template>
                <template v-else>
                    <template v-if="!edit.includes('bus_days')">
                        <p class="text-large">
                            Business Days
                            <span
                                class="border-round bg-primary ml-3 mr-1 px-3 py-1"
                                @click="edit.push('bus_days')"
                            >
                                {{ taskData.bus_days }}
                            </span>
                        </p>
                        <i
                            class="pi pi-pencil hover-edit-btn"
                            @click="edit.push('bus_days')"
                        ></i>
                    </template>
                    <template v-else>
                        <label for="bus-days" class="mr-3">Business Days</label>
                        <InputNumber
                            id="bus-days"
                            v-model="taskData.bus_days"
                            :maxFractionDigits="1"
                            showButtons
                            mode="decimal"
                            :step="0.5"
                            :disabled="taskData.tasks && taskData.tasks.length > 0"
                            :autofocus="true"
                        />
                        <template v-if="!loading.includes('bus_days')">
                            <Button
                                icon="pi pi-times"
                                class="p-button-rounded p-button-text"
                                @click="getTask(taskData.id, 'bus_days')"
                            />
                            <Button
                                icon="pi pi-check"
                                class="p-button-rounded p-button-success p-button-text"
                                @click="saveTask('bus_days')"
                            />
                        </template>
                        <template v-else>
                            <i class="pi pi-spin pi-spinner mx-3"></i>
                        </template>
                    </template>
                </template>
            </div>
            <div class="col-4 flex align-items-center">
                <span class="mr-3">Gate</span>
                <template v-for="gate in gateOptions" :key="gate">
                    <span
                        class="border-circle w-2rem h-2rem flex align-items-center justify-content-center mx-1"
                        :class="
                            taskData.gate == gate
                                ? 'text-white surface-800'
                                : 'text-400 border-1 border-400'
                        "
                        >{{ gate }}</span
                    >
                </template>
            </div>
            <div class="col-4 flex align-items-center">
                <span class="mr-3">Subgate</span>
                <template v-for="subgate in subgateOptions" :key="subgate">
                    <span
                        class="border-circle w-2rem h-2rem flex align-items-center justify-content-center mx-1"
                        :class="
                            taskData.subgate == subgate
                                ? 'text-white surface-800'
                                : 'text-400 border-1 border-400'
                        "
                        >{{ subgate }}</span
                    >
                </template>
            </div>
        </div>
        <div class="grid mt-4 align-items-center">
            <div class="col-4 pr-5">
                <div class="flex align-items-center pb-2">
                    <p class="text-large">
                        Palt Status
                        <span class="border-round text-white ml-3 mr-1 px-3 py-1" :class="paltStatus(taskData.palt_plan, taskData.palt_actual, 'color')">
                            {{ paltStatus(taskData.palt_plan, taskData.palt_actual, 'text') }}
                        </span>
                    </p>
                </div>
                <PaltChart :task_id="taskData.id" :palt_plan="taskData.palt_plan" :palt_actual="taskData.palt_actual"></PaltChart>
            </div>
            <div class="col-8">
                <div class="flex align-items-center pb-2">
                    <p class="text-large w-6">
                        Start Date
                        <span class="border-round text-white surface-800 ml-3 mr-1 px-3 py-1">
                            {{ dateString(formatDate(taskData.start_date)) }}
                        </span>
                    </p>
                    <p class="text-large ml-3 w-6 pl-2">
                        End Date
                        <span class="border-round text-white surface-800 ml-3 mr-1 px-3 py-1">
                            {{ dateString(formatDate(taskData.end_date)) }}
                        </span>
                    </p>
                </div>
                <DateRange
                    :startDate="formatDate(taskData.start_date)"
                    :endDate="formatDate(taskData.end_date)"
                    :isExpanded="true"
                ></DateRange>
            </div>
        </div>
        <div class="grid mt-4 align-items-center">
            <div class="col-12">
                <template v-if="!edit.includes('poc')">
                    <div class="flex align-items-center">
                        <p class="text-large">Point of Contact</p>
                        <span class="border-round text-white bg-primary ml-3 px-4 py-2" @click="edit.push('poc')">
                            {{ taskData.poc ? formatPOC(taskData.poc) : '-' }}
                        </span>
                        <template v-if="taskData.poc">
                            <a :href="`mailto:${taskData.poc.email}`"><Button icon="pi pi-inbox" class="p-button-rounded p-button-outlined p-button-sm ml-2" /></a>
                            <Button icon="pi pi-copy" class="p-button-rounded p-button-outlined p-button-sm ml-2" v-clipboard:copy="taskData.poc.email" @click="copyEmail"/>
                        </template>
                        <i
                            class="pi pi-pencil hover-edit-btn ml-1"
                            @click="edit.push('poc')"
                        ></i>
                    </div>
                </template>
                <template v-else>
                    <div class="flex align-items-center">
                        <p class="text-large mr-4">Point of Contact</p>
                        <Dropdown
                            v-model="taskPocId"
                            :options="fPocs"
                            optionLabel="title"
                            optionValue="value"
                            placeholder="Select Point of Contact"
                        ></Dropdown>
                        <template v-if="!loading.includes('poc')">
                            <Button
                                icon="pi pi-times"
                                class="p-button-rounded p-button-text"
                                @click="getTask(taskData.id, 'poc')"
                            />
                            <Button
                                icon="pi pi-check"
                                class="p-button-rounded p-button-success p-button-text"
                                @click="saveTask('poc')"
                            />
                        </template>
                        <template v-else>
                            <i class="pi pi-spin pi-spinner mx-3"></i>
                        </template>
                    </div>
                </template>
            </div>
        </div>
        <div class="grid mt-4 align-items-center">
            <div class="col-12">
                <template v-if="!edit.includes('comments')">
                    <div class="flex align-items-center">
                        <p class="text-large m-0">Comments</p>
                        <i
                            class="pi pi-pencil hover-edit-btn"
                            @click="edit.push('comments')"
                        ></i>
                    </div>
                    <p class="text-sm text-800 p-4 bg-blue-50 mb-0" @click="edit.push('comments')">
                        <template v-if="taskData.comments">
                            {{ taskData.comments }}
                        </template>
                        <template v-else>
                            <span class="text-500"><em>Click to add comments...</em></span>
                        </template>
                    </p>
                </template>
                <template v-else>
                    <div class="flex align-items-center">
                        <p class="text-large">Comments</p>
                        <div class="flex-auto"></div>
                        <template v-if="!loading.includes('comments')">
                            <Button
                                icon="pi pi-times"
                                class="p-button-rounded p-button-text"
                                @click="getTask(taskData.id, 'comments')"
                            />
                            <Button
                                icon="pi pi-check"
                                class="p-button-rounded p-button-success p-button-text"
                                @click="saveTask('comments')"
                            />
                        </template>
                        <template v-else>
                            <i class="pi pi-spin pi-spinner mx-3"></i>
                        </template>
                    </div>
                    <Textarea v-model="taskData.comments" :autoResize="true" class="w-full" rows="5" :autofocus="true"/>
                </template>
            </div>
        </div>
        <div class="grid mt-4 align-items-center">
            <div class="col-12">
                <p class="text-large">Quick Links</p>
                <template v-if="taskData.links">
                    <template v-for="(link, idx) in taskData.links" :key="link.url">
                        <div class="flex align-items-center">
                            <a :href="link.url" class="flex w-full my-1" target="_blank">
                                <Button class="text-sm px-3 w-full text-left" icon="pi pi-arrow-up-right" iconPos="right" :label="link.title" />
                            </a>
                            <Button
                                v-if="!loading.includes(`link-${idx}`)"
                                icon="pi pi-pencil"
                                class="p-button-link p-button-sm"
                                @click="openEditLinkModal(idx)"
                            />
                            <i v-else class="pi pi-spin pi-spinner mx-3"></i>
                        </div>
                    </template>
                </template>
                <Button class="p-button-text p-button-sm px-1 mt-2" icon="pi pi-plus" iconPos="left" label="Link" @click="showNewLinkModal = true"/>
            </div>
        </div>
        <Dialog
            v-model:visible="showEditLinkModal"
            :style="{ width: '700px' }"
            header="Edit Link"
            :modal="true"
            class="p-fluid"
            :closeOnEscape="true"
            :dismissableMask="true"
            :draggable="false"
            @hide="showEditLinkModal = false"
        >
            <div class="formgrid grid">
                <div class="field col-6">
                    <label for="title">Title</label>
                    <InputText id="title" v-model="taskData.links[currIdx].title" />
                </div>
                <div class="field col-6">
                    <label for="department">Meta</label>
                    <InputText id="department" v-model="taskData.links[currIdx].meta" />
                </div>
                <div class="field col-12">
                    <label for="url">Url</label>
                    <InputText id="url" v-model="taskData.links[currIdx].url" />
                </div>
            </div>
            <template #footer>
                <div class="flex">
                    <Button
                        label="Delete"
                        icon="pi pi-trash"
                        class="p-button-danger"
                        @click="deleteLink()"
                    />
                    <span class="flex-auto"></span>
                    <Button
                        label="Cancel"
                        icon="pi pi-times"
                        class="p-button-text"
                        @click="getTask(taskData.id, `link-${currIdx}`)"
                    />
                    <Button
                        label="Save"
                        icon="pi pi-check"
                        class="p-button-success"
                        @click="saveTask(`link-${currIdx}`)"
                    />
                </div>
            </template>
        </Dialog>
        <Dialog
            v-model:visible="showNewLinkModal"
            :style="{ width: '700px' }"
            header="Add Link"
            :modal="true"
            class="p-fluid"
            :closeOnEscape="true"
            :dismissableMask="true"
            :draggable="false"
            @hide="showNewLinkModal = false"
        >
            <div class="formgrid grid">
                <div class="field col-6">
                    <label for="title">Title</label>
                    <InputText id="title" v-model="newLink.title" />
                </div>
                <div class="field col-6">
                    <label for="department">Meta</label>
                    <InputText id="department" v-model="newLink.meta" />
                </div>
                <div class="field col-12">
                    <label for="url">Url</label>
                    <InputText id="url" v-model="newLink.url" />
                </div>
            </div>
            <template #footer>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="closeNewLinkModule"
                />
                <Button
                    label="Save"
                    icon="pi pi-check"
                    class="p-button-success"
                    @click="addLink"
                />
            </template>
        </Dialog>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch, nextTick } from 'vue'
import { useRoute } from 'vue-router'
import type {
    Task,
    Contract,
    PointOfContact,
    SimpleTask,
    StatusType,
	Link,
} from '@/types/ContractData.type'
import { ContractService, TaskService } from '@/api/ContractService'
import {
    formatDate,
    dateString,
    formatPOC,
    formatUpdateTask,
    unformatTaskParam,
} from '@/composables/ContractCalcs.composable'
import { useToast } from 'primevue/usetoast'

import Button from 'primevue/button'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Textarea from 'primevue/textarea'
import Dropdown from 'primevue/dropdown'
import Dialog from 'primevue/dialog'

import StatusIcon from '@/components/StatusIcon.vue'
import DateRange from '@/components/DateRange.vue'
import PaltChart from '@/components/PaltChart.vue'

export default defineComponent({
    name: 'TaskContent',

    components: {
        Button,
        InputText,
        InputNumber,
        Textarea,
        StatusIcon,
        Dropdown,
        Dialog,
        DateRange,
        PaltChart,
    },

    props: {
        pocs: {
            type: Array as PropType<PointOfContact[]>,
            required: true,
        },
    },

    emits: ['refresh_data', 'get_status'],

    setup(props, { emit }) {
        const route = useRoute()
        const toast = useToast()
        const taskData = ref({} as Task)

        const loading = ref([] as string[])
        const edit = ref([] as string[])

        // const loading = ref(true)
        // const edit = ref(false)

        const editTitle = ref(false)
        const editSubtitle = ref(false)
        const editStatus = ref(false)
        const editBusDays = ref(false)

        const changeDetected = ref(false)

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
        ] as { title: string; value: StatusType }[]

        function getToastTitle(field: string) {
            let title: string = ''

            switch (field) {
                case 'title':
                    title = 'Title'
                    break
                case 'sub_title':
                    title = 'Subtitle'
                    break
                case 'status':
                    title = 'Status'
                    break
                case 'bus_days':
                    title = 'Business Days'
                    break
                case 'poc':
                    title = 'Point of Contact'
                    break
                case 'comments':
                    title = 'Comments'
                    break
                case 'link':
                    title = "Links"
                    break
                case `link-${currIdx.value}`:
                    title = "Link"
                    break
            }

            return title
        }

        function paltStatus(plan: number, actual: number, returnType: string) {
            if (plan > actual) {
                if (returnType == 'text') {
                    return 'EARLY'
                }
                else return 'bg-green-500'
            }
            else if (plan < actual) {
                if (returnType == 'text') {
                    return 'LATE'
                }
                else return 'bg-red-500'
            }
            else {
                if (returnType == 'text') {
                    return 'ON TIME'
                }
                else return 'bg-blue-500'
            }
        }

        function cannotEdit(field: string) {
            toast.add({
                severity: 'warn',
                summary: 'Invalid Command',
                detail: `Cannot Edit ${getToastTitle(field)} of Parent Task`,
                life: 3000,
            })
        }

        function copyEmail() {
            toast.add({
                severity: 'success',
                summary: 'Copied!',
                detail: `Email copied to clipboard`,
                life: 3000,
            })
        }

        const gateOptions = [1, 2, 3, 4]
        const subgateOptions = [1, 2, 3, 4, 5]
        const taskPocId = ref(null as null|number)

        const currIdx = ref(0)
        const showEditLinkModal = ref(false)

        function openEditLinkModal(idx: number) {
            currIdx.value = idx
            showEditLinkModal.value = true
        }

        function closeEditLinkModal() {
            showEditLinkModal.value = false
            getTask(taskData.value.id, `link-${currIdx.value}`)
            nextTick(() => {
                currIdx.value = 0
            })
        }

        function deleteLink() {
            if (taskData.value.links) {
                taskData.value.links?.splice(currIdx.value, 1)
                if (taskData.value.links.length <= 0) taskData.value.links = null
            }

            saveTask('task')
            showEditLinkModal.value = false
        }

        const showNewLinkModal = ref(false)
        const newLink = ref({} as Link)

        function closeNewLinkModule() {
            showNewLinkModal.value = false
            newLink.value = {} as Link
        }

        function addLink() {
            if (!newLink.value.url.includes('https://') && !newLink.value.url.includes('http://')) {
                newLink.value.url = 'https://' + newLink.value.url
            }
            if (taskData.value.links) taskData.value.links.push(newLink.value)
            else taskData.value.links = [newLink.value]
            saveTask('link')
        }

        function getTask(id: number, field: string = 'task') {
            loading.value.push(field)
            TaskService.get(id)
                .then((res) => {
                    taskData.value = res.data
                    if (res.data.poc) {
                        taskPocId.value = res.data.poc.id
                    }
                    // toast.add({
                    //     severity: 'info',
                    //     summary: 'Fetched',
                    //     detail: 'Task Data Retrieved',
                    //     life: 3000,
                    // })
                })
                .catch((err) => {
                    console.warn('Error Fetching Task', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Loading Task',
                        life: 3000,
                    })
                })
                .finally(() => {
                    if (field != 'task') {
                        edit.value.splice(edit.value.findIndex((e) => { return e === field }), 1)
                        loading.value.splice(loading.value.findIndex((l) => { return l === field }), 1)
                        showEditLinkModal.value = false
                    }
                    emit('get_status', taskData.value.status)
                })
        }
        getTask(unformatTaskParam(route.params.task.toString()))

        const fPocs = [
            {
                value: null,
                title: '-',
            },
            ...props.pocs.map((poc: PointOfContact) => {
                return {
                    value: poc.id,
                    title: formatPOC(poc),
                }
            }),
        ]

        watch(
            () => route.params.task?.toString(),
            (nTask: String) => {
                if (route.params.task) {
                    getTask(unformatTaskParam(nTask.toString()))
                }
            },
        )

        function saveTask(field: string) {
            loading.value.push(field)
            taskData.value.poc = taskPocId.value ? (props.pocs[props.pocs.findIndex((poc) => { return poc.id === taskPocId.value })] || null) : null
            const { data } = formatUpdateTask(taskData.value)
            TaskService.update(data.id, data)
                .then((res) => {
                    taskData.value = res.data
                    toast.add({
                        severity: 'success',
                        summary: 'Saved',
                        detail: `${getToastTitle(field)} Saved`,
                        life: 3000,
                    })
                    emit('refresh_data', taskData.value)
                })
                .catch((err) => {
                    console.warn('Error Updating Task', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: `Error Saving ${getToastTitle(field)}`,
                        life: 3000,
                    })
                })
                .finally(() => {
                    edit.value.splice(edit.value.findIndex((e) => { return e === field }), 1)
                    loading.value.splice(loading.value.findIndex((l) => { return l === field }), 1)
                    changeDetected.value = showNewLinkModal.value = showEditLinkModal.value = false
                })
        }

        return {
            loading,
            edit,
            editTitle,
            editSubtitle,
            editStatus,
            editBusDays,
            taskData,
            statusTypes,
            paltStatus,
            cannotEdit,
            copyEmail,
            gateOptions,
            subgateOptions,
            currIdx,
            showEditLinkModal,
            openEditLinkModal,
            closeEditLinkModal,
            deleteLink,
            addLink,
            showNewLinkModal,
            closeNewLinkModule,
            newLink,
            formatPOC,
            fPocs,
            taskPocId,
            getTask,
            formatDate,
            dateString,
            saveTask,
        }
    },
})
</script>

<style lang="scss">
#bus-days {
    width: 4rem !important;
}
</style>
