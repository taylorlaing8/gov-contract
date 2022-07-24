<template>
    <DataTable
        :value="taskData"
        :loading="loading"
        stripedRows
        class="p-datatable-sm"
        dataKey="slug"
        v-model:selection="selectedTask"
        v-model:expandedRows="expandedRows"
        :selectionMode="canEdit ? 'single' : null"
        :row-class="rowClass"
        @rowReorder="onTaskReorder"
        @row-click="openTaskModal()"
    >
        <Column v-if="canEdit" :rowReorder="true" style="min-width: 2rem; width: 5%; text-align: center" :reorderableColumn="false" />
        <Column v-if="!expandLoad" :expander="true" style="min-width: 2rem; width: 5%" />
        <Column
            field="title"
            header="Title / Subtitle"
            style="width: 45%"
        >
            <template #body="slotProps">
                <h5 class="text-lg font-normal">
                    {{ slotProps.data.title }}
                </h5>
                <span class="text-sm">{{
                    slotProps.data.sub_title || null
                }}</span>
            </template>
        </Column>
        <Column field="gate" header="Gate" style="width: 10%"></Column>
        <Column
            field="sub_gate"
            header="Sub Gate"
            style="width: 10%"
        ></Column>
        <Column
            field="palt_plan"
            header="Palt Planned"
            style="width: 10%"
        ></Column>
        <Column
            field="bus_days"
            header="Business Days"
            style="width: 10%"
        ></Column>
        <Column
            v-if="canEdit"
            style="width: 5%"
        >
            <template #body="slotProps">
                <Button icon="pi pi-ellipsis-h" class="p-button-rounded p-button-text p-button-sm" @click="openEditMenu($event, slotProps)"/>
            </template>
        </Column>
        <template #expansion="parentTask">
            <div class="subtasks-table">
                <DataTable
                    :value="parentTask.data.tasks"
                    v-model:selection="selectedSubtask"
                    class="p-datatable-sm"
                    stripedRows
                    :selectionMode="canEdit ? 'single' : null"
                    @rowReorder="onSubtaskReorder(parentTask.data.slug, $event)"
                    @row-click="openTaskModal(parentTask.data)"
                >
                    <Column v-if="canEdit" :rowReorder="true" style="margin-left: 5%; min-width: 2rem; width: 5%; text-align: center" :reorderableColumn="false" />
                    <Column
                        field="title"
                        header="Title / Subtitle"
                        style="width: 45%"
                    >
                        <template #body="slotProps">
                            <h5 class="text-lg font-normal">
                                {{ slotProps.data.title }}
                            </h5>
                            <span class="text-sm">{{
                                slotProps.data.sub_title || null
                            }}</span>
                        </template>
                    </Column>
                    <Column
                        field="gate"
                        header="Gate"
                        style="width: 10%"
                    ></Column>
                    <Column
                        field="sub_gate"
                        header="Sub Gate"
                        style="width: 10%"
                    ></Column>
                    <Column
                        field="palt_plan"
                        header="Palt Planned"
                        style="width: 10%"
                    ></Column>
                    <Column
                        field="bus_days"
                        header="Business Days"
                        style="width: 10%"
                    ></Column>
                    <Column
                        v-if="canEdit"
                        style="width: 5%"
                    >
                        <template #body="slotProps">
                            <Button icon="pi pi-ellipsis-h" class="p-button-rounded p-button-text p-button-sm" @click="openEditMenu($event, slotProps, parentTask.data)"/>
                        </template>
                    </Column>
                </DataTable>
            </div>
        </template>
        <!-- <template #paginatorstart>
            <Button icon="pi pi-refresh" class="p-button-text" :loading="loading" @click="getPocs"/>
        </template>
        <template #paginatorend>
            <Button icon="pi pi-cloud" class="p-button-text" />
        </template> -->
    </DataTable>
    <ContextMenu :model="editMenu" ref="eMenu" />
    <Dialog
        v-model:visible="showTaskModal"
        :style="{ width: '800px' }"
        header="Edit Task"
        :modal="true"
        class="p-fluid"
        :closeOnEscape="true"
        :dismissableMask="true"
        :draggable="false"
        @hide="closeTaskModal"
    >
        <div class="formgrid grid">
            <div class="field col-12">
                <label for="title">Title</label>
                <InputText id="title" v-model="modalTask.title" />
            </div>
            <div class="field col-12">
                <label for="sub-title">Subtitle</label>
                <InputText id="sub-title" v-model="modalTask.sub_title" />
            </div>
            <div class="field col-6">
                <label for="gate">Gate</label>
                <InputNumber id="gate" v-model="modalTask.gate" showButtons :min="1" :max="4" />
            </div>
            <div class="field col-6">
                <label for="sub-gate">Sub Gate</label>
                <InputNumber id="sub-gate" v-model="modalTask.sub_gate" showButtons :min="0" :max="5" :disabled="modalTask.gate < 4" />
            </div>
            <div class="field col-6">
                <label for="palt-plan">Palt Planned</label>
                <InputNumber id="palt-plan" v-model="modalTask.palt_plan" :maxFractionDigits="1" showButtons mode="decimal" :min="0" :step="0.50" />
            </div>
            <div class="field col-6">
                <label for="bus-days">Business Days</label>
                <InputNumber id="bus-days" v-model="modalTask.bus_days" :maxFractionDigits="1" showButtons mode="decimal" :min="0" :step="0.50" />
            </div>
            <div class="field col-12">
                <p>Quick Links</p>
                <template v-for="(link, idx) in modalTask.links" :key="idx">
                    <span class="text-primary text-sm">Link {{idx + 1}}</span>
                    <div class="flex align-items-center">
                        <div class="formgrid grid w-full pt-2 pr-2">
                            <div class="field col-6">
                                <InputText placeholder="Title" v-model="modalTask.links[idx].title" />
                            </div>
                            <div class="field col-6">
                                <InputText placeholder="Meta (optional)" v-model="modalTask.links[idx].meta" />
                            </div>
                            <div class="field col-12">
                                <InputText placeholder="URL" v-model="modalTask.links[idx].url" />
                            </div>
                        </div>
                        <Button
                            icon="pi pi-times"
                            class="p-button-text mb-3"
                            @click="modalTask.links.splice(idx, 1)"
                        />
                    </div>
                </template>
                <Button class="p-button-text p-button-sm px-1 mt-2 w-auto" icon="pi pi-plus" iconPos="left" label="Link" @click="addLink(modalTask)"/>
            </div>
        </div>
        <template #footer>
            <div class="flex">
                <!-- <Button
                    label="Delete"
                    icon="pi pi-trash"
                    class="p-button-danger"
                    @click="deleteTask"
                /> -->
                <span class="flex-auto"></span>
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text"
                    @click="closeTaskModal"
                />
                <Button
                    label="Accept"
                    icon="pi pi-check"
                    class="p-button-success"
                    @click="saveTask"
                />
            </div>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent, nextTick, PropType, ref, watch } from 'vue'
import type { Link, TaskBuild } from '@/types/ContractData.type'
import _ from "lodash"

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import ContextMenu from 'primevue/contextmenu'

import { useToast } from 'primevue/usetoast'
import { generateSlug } from '@/composables/ContractCalcs.composable'

export default defineComponent({
    name: 'TemplateContent',

    props: {
        templateTasks: {
            type: Object as PropType<TaskBuild[]>,
            required: true,
        },
        canEdit: {
            type: Boolean,
            required: false,
            default: false,
        }
    },

    components: {
        Button,
        Dialog,
        DataTable,
        Column,
        InputText,
        InputNumber,
        ContextMenu,
    },

    emits: ['update_tasks'],

    setup(props, { emit }) {
        const toast = useToast()
        const taskData = ref(props.templateTasks)

        const selectedTask = ref({} as TaskBuild)
        const selectedSubtask = ref({} as TaskBuild)
        const modalTask = ref({} as TaskBuild)

        const expandLoad = ref(false)
        const expandedRows = ref([])

        const loading = ref(false)
        const changeDetected = ref(false)

        const subtaskParent = ref({} as TaskBuild)
        const isSubtask = ref(false)
        const showTaskModal = ref(false)

        const blankTask: TaskBuild = {
            bus_days: 0,
            comments: null,
            gate: 1,
            links: null,
            palt_plan: 0,
            poc: null,
            slug: 'new-task',
            ssp_date: null,
            status: 'IC',
            sub_gate: 0,
            sub_title: null,
            title: 'NEW TASK',
            tasks: null,
        }

        const eMenu = ref()
        const editMenu = ref([
            { label: 'Add Task', icon: 'pi pi-fw pi-plus', command: () => insertTask() },
            { label: 'Add Subtask', icon: 'pi pi-fw pi-arrow-right', command: () => insertSubtask() },
            { separator:true },
            { label: 'Delete', icon: 'pi pi-fw pi-trash', command: () => deleteTask() }
        ])
        
        const editMenuTask = ref({} as {index: number, data: TaskBuild})
        const editMenuParent = ref(undefined as TaskBuild | undefined)

        function openEditMenu(event, context, parentTask?: TaskBuild) {
            editMenuTask.value = {index: context.index, data: context.data}
            editMenuParent.value = parentTask
            eMenu.value.show(event)
        }

        function insertTask() {
            const newTask = {
                ...blankTask,
                gate: editMenuTask.value.data.gate,
                sub_gate: editMenuTask.value.data.sub_gate,
            }

            if (editMenuParent.value && editMenuParent.value.tasks) {
                editMenuParent.value.tasks.splice(editMenuTask.value.index, 0, newTask)
                if (editMenuParent.value.tasks.length === 0) editMenuParent.value.tasks = null
            }
            else {
                taskData.value.splice(editMenuTask.value.index, 0, newTask)
                if (taskData.value.length === 0) taskData.value.push(newTask)
            }

            changeDetected.value = true
            emit('update_tasks', taskData.value, changeDetected.value)
        }

        function insertSubtask() {
            const newTask = {
                ...blankTask,
                gate: editMenuTask.value.data.gate,
                sub_gate: editMenuTask.value.data.sub_gate,
            }

            if (editMenuParent.value && editMenuParent.value.tasks) {
                toast.add({
                    severity: 'warn',
                    summary: 'Invalid Command',
                    detail: 'Max Levels Reached (2)',
                    life: 3000,
                })
            }
            else {
                expandLoad.value = true

                if (editMenuTask.value.data.tasks && editMenuTask.value.data.tasks.length > 0) editMenuTask.value.data.tasks.push(newTask)
                else editMenuTask.value.data.tasks = [newTask]

                changeDetected.value = true
                expandLoad.value = false
                emit('update_tasks', taskData.value, changeDetected.value)
            }
        }

        function deleteTask() {
            expandLoad.value = true

            if (editMenuParent.value && editMenuParent.value.tasks) {
                editMenuParent.value.tasks.splice(editMenuTask.value.index, 1)
                if (editMenuParent.value.tasks.length === 0) {
                    editMenuParent.value.tasks = null
                    expandedRows.value = [] // TODO : Don't close all expansion panels just because one panel is now empty
                }
            }
            else {
                taskData.value.splice(editMenuTask.value.index, 1)
                if (taskData.value.length === 0) taskData.value.push(blankTask)
            }

            changeDetected.value = true
            expandLoad.value = false
            emit('update_tasks', taskData.value, changeDetected.value)
        }

        watch(() => props.templateTasks, (newTasks, oldTasks) => {
            taskData.value = newTasks
        }, { deep: true })

        function openTaskModal(data?: TaskBuild) {
            if (props.canEdit) {
                if (data) {
                    isSubtask.value = true
                    subtaskParent.value = data
                }
                else isSubtask.value = false

                nextTick(() => {
                    if (isSubtask.value) modalTask.value = _.cloneDeep(selectedSubtask.value)
                    else modalTask.value = _.cloneDeep(selectedTask.value)
                    showTaskModal.value = true
                })
            }
        }

        function closeTaskModal() {
            showTaskModal.value = false
            selectedTask.value = selectedSubtask.value = modalTask.value = {} as TaskBuild
        }

        const rowClass = (rowData) => {
            return rowData.tasks ? '' : 'no-expander'
        }

        function addLink(task: TaskBuild) {
            if (task.links) {
                task.links.push({} as Link)
            }
            else {
                task.links = [{} as Link]
            }
        }

        function onTaskReorder(event) {
            taskData.value = event.value
            if (!changeDetected.value) changeDetected.value = true
            emit('update_tasks', taskData.value, changeDetected.value)
        }

        function onSubtaskReorder(slug: string, event) {
            const idx = taskData.value.findIndex((t) => t.slug === slug)
            taskData.value[idx].tasks = event.value
            if (!changeDetected.value) changeDetected.value = true
            emit('update_tasks', taskData.value, changeDetected.value)
        }

        function formatLinks(task: TaskBuild) {
            let links = [] as Link[] | undefined
            links = task.links?.filter((link) => {
                if (link.url && link.url.length > 0) return link
                else return
            })

            links?.forEach((link) => {
                if (!link.url.includes('https://') && !link.url.includes('http://')) {
                    link.url = 'https://' + link.url
                }
            })

            task.links = links && links.length > 0 ? links : null

            return task
        }

        function saveTask() {
            if (typeof modalTask.value.sub_title === 'string' && modalTask.value.sub_title.length <= 0) modalTask.value.sub_title = null
            modalTask.value = formatLinks(modalTask.value)
            modalTask.value.slug = generateSlug(modalTask.value.title.toString())
            
            if (isSubtask.value) {
                if (!_.isEqual(modalTask.value, selectedSubtask.value)) {
                    for (const key in selectedSubtask.value) {
                        selectedSubtask.value[key] = modalTask.value[key]
                    }

                    const subgate = ref(subtaskParent.value.tasks ? subtaskParent.value.tasks[0].sub_gate : null as null|number)
                    subtaskParent.value.palt_plan = 0
                    subtaskParent.value.bus_days = 0
                    subtaskParent.value.tasks?.forEach((task) => {
                        if (task.sub_gate != subgate.value) subgate.value = null
                        subtaskParent.value.palt_plan += task.palt_plan
                        subtaskParent.value.bus_days += task.bus_days
                    })
                    subtaskParent.value.sub_gate = subgate.value

                    changeDetected.value = true
                    emit('update_tasks', taskData.value, changeDetected.value)
                }
            }
            else {
                if (!_.isEqual(modalTask.value, selectedTask.value)) {
                    for (const key in selectedTask.value) {
                        selectedTask.value[key] = modalTask.value[key]
                    }

                    selectedTask.value.tasks?.forEach((task) => {
                        task.gate = selectedTask.value.gate
                    })

                    changeDetected.value = true
                    emit('update_tasks', taskData.value, changeDetected.value)
                }
            }

            closeTaskModal()
        }

        return {
            loading,
            changeDetected,
            eMenu,
            editMenu,
            openEditMenu,
            taskData,
            selectedTask,
            selectedSubtask,
            modalTask,
            expandedRows,
            expandLoad,
            showTaskModal,
            openTaskModal,
            closeTaskModal,
            rowClass,
            onTaskReorder,
            onSubtaskReorder,
            addLink,
            saveTask,
        }
    },
})
</script>

<style lang="scss">
.subtasks-table {
    margin-left: 2.5rem;
}
.p-datatable-tbody {
    & tr.no-expander {
        td .p-row-toggler {
            display: none !important;
        }
    }
}
</style>
