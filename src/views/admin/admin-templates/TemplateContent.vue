<template>
    <div class="grid align-items-center" v-if="template && template.data">
        <div class="col-9">
            <div class="flex align-items-center">
                <template v-if="!editTitle">
                    <h2 class="">{{ template.title }}</h2>
                    <i class="pi pi-pencil hover-edit-btn" @click="editTitle = true"></i>
                </template>
                <template v-else>
                    <InputText id="title" class="p-inputtext-lg" v-model="template.title" />
                    <Button
                        icon="pi pi-times"
                        class="p-button-rounded p-button-text"
                        @click="() => {
                            editTitle = false
                            getTemplate()
                        }"
                    />
                    <Button
                        icon="pi pi-check"
                        class="p-button-rounded p-button-success p-button-text"
                        @click="() => {
                            editTitle = false
                            changeDetected = true
                        }"
                    />
                </template>
            </div>
             <div class="flex align-items-center">
                <template  v-if="!editSubtitle">
                    <p class="m-0">{{ template.sub_title ? template.sub_title : '-' }}</p>
                    <i class="pi pi-pencil hover-edit-btn" @click="editSubtitle = true"></i>
                </template>
                <template v-else>
                    <InputText id="title" class="p-inputtext-sm" v-model="template.sub_title" />
                    <Button
                        icon="pi pi-times"
                        class="p-button-rounded p-button-text"
                        @click="() => {
                            editSubtitle = false
                            getTemplate()
                        }"
                    />
                    <Button
                        icon="pi pi-check"
                        class="p-button-rounded p-button-success p-button-text"
                        @click="() => {
                            editSubtitle = false
                            changeDetected = true
                        }"
                    />
                </template>
             </div>
        </div>
        <div class="col-3 text-right" v-if="changeDetected">
            <Button
                label="Cancel"
                icon="pi pi-times"
                class="p-button-text"
                @click="getTemplate"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                class="p-button-success header-button"
                @click="saveTemplate"
            />
        </div>
        <div class="col-12 mt-4">
            <DataTable
                :value="template.data.tasks"
                :loading="loading"
                stripedRows
                class="p-datatable-sm"
                dataKey="slug"
                v-model:selection="selectedTask"
                v-model:expandedRows="expandedRows"
                selectionMode="single"
                :row-class="rowClass"
                @rowReorder="onTaskReorder"
                @row-click="openTaskModal"
            >
                <Column :rowReorder="true" style="min-width: 2rem; width: 5%; text-align: center" :reorderableColumn="false" />
                <Column :expander="true" style="min-width: 2rem; width: 5%" />
                <Column
                    field="title"
                    header="Title / Subtitle"
                    style="width: 50%"
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
                <template #expansion="slotProps">
                    <div class="subtasks-table">
                        <DataTable
                            :value="slotProps.data.tasks"
                            v-model:selection="selectedSubtask"
                            class="p-datatable-sm"
                            stripedRows
                            selectionMode="single"
                            @rowReorder="onSubtaskReorder(slotProps.data.slug, $event)"
                            @row-click="openSubtaskModal(slotProps.data)"
                        >
                            <Column :rowReorder="true" style="margin-left: 5%; min-width: 2rem; width: 5%; text-align: center" :reorderableColumn="false" />
                            <Column
                                field="title"
                                header="Title / Subtitle"
                                style="width: 50%"
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
        </div>
    </div>
    <!-- <ConfirmDialog></ConfirmDialog> -->
    <Dialog
        v-model:visible="showTaskModal"
        :style="{ width: '700px' }"
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
                <InputText id="title" v-model="selectedTask.title" />
            </div>
            <div class="field col-12">
                <label for="sub-title">Subtitle</label>
                <InputText id="sub-title" v-model="selectedTask.sub_title" />
            </div>
            <div class="field col-6">
                <label for="gate">Gate</label>
                <InputNumber id="gate" v-model="selectedTask.gate" showButtons :min="0" :max="4"/>
            </div>
            <div class="field col-6">
                <label for="sub-gate">Sub Gate</label>
                <InputNumber id="sub-gate" v-model="selectedTask.sub_gate" showButtons :min="0" :max="5" :disabled="selectedTask.tasks && selectedTask.tasks.length > 0"/>
            </div>
            <div class="field col-6">
                <label for="palt-plan">Palt Planned</label>
                <InputNumber id="palt-plan" v-model="selectedTask.palt_plan" :maxFractionDigits="1" showButtons mode="decimal" :step="0.50" :disabled="selectedTask.tasks && selectedTask.tasks.length > 0"/>
            </div>
            <div class="field col-6">
                <label for="bus-days">Business Days</label>
                <InputNumber id="bus-days" v-model="selectedTask.bus_days" :maxFractionDigits="1" showButtons mode="decimal" :step="0.50" :disabled="selectedTask.tasks && selectedTask.tasks.length > 0"/>
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
    <Dialog
        v-model:visible="showSubtaskModal"
        :style="{ width: '700px' }"
        header="Edit Subtask"
        :modal="true"
        class="p-fluid"
        :closeOnEscape="true"
        :dismissableMask="true"
        :draggable="false"
        @hide="closeSubtaskModal"
    >
        <div class="formgrid grid">
            <div class="field col-12">
                <label for="title">Title</label>
                <InputText id="title" v-model="selectedSubtask.title" />
            </div>
            <div class="field col-12">
                <label for="sub-title">Subtitle</label>
                <InputText id="sub-title" v-model="selectedSubtask.sub_title" />
            </div>
            <div class="field col-6">
                <label for="gate">Gate</label>
                <InputNumber id="gate" v-model="selectedSubtask.gate" showButtons :min="0" :max="4" :disabled="true"/>
            </div>
            <div class="field col-6">
                <label for="sub-gate">Sub Gate</label>
                <InputNumber id="sub-gate" v-model="selectedSubtask.sub_gate" showButtons :min="0" :max="5"/>
            </div>
            <div class="field col-6">
                <label for="palt-plan">Palt Planned</label>
                <InputNumber id="palt-plan" v-model="selectedSubtask.palt_plan" showButtons :maxFractionDigits="1" mode="decimal" :step="0.50"/>
            </div>
            <div class="field col-6">
                <label for="bus-days">Business Days</label>
                <InputNumber id="bus-days" v-model="selectedSubtask.bus_days" showButtons :maxFractionDigits="1" mode="decimal" :step="0.50"/>
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
                    @click="closeSubtaskModal"
                />
                <Button
                    label="Accept"
                    icon="pi pi-check"
                    class="p-button-success"
                    @click="saveSubtask"
                />
            </div>
        </template>
    </Dialog>
</template>

<script lang="ts">
import { defineComponent, nextTick, ref, watch } from 'vue'
import { TemplateService } from '@/api/ContractService'
import type { TaskBuild, Template } from '@/types/ContractData.type'
import { generateSlug } from '@/composables/ContractCalcs.composable'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'

import { useToast } from 'primevue/usetoast'

export default defineComponent({
    name: 'TemplateContent',

    props: {
        template_id: {
            type: Number,
            required: true,
        },
    },

    components: {
        Button,
        Dialog,
        DataTable,
        Column,
        InputText,
        InputNumber,
    },

    setup(props) {
        const selectedTask = ref({} as TaskBuild)
        const selectedSubtask = ref({} as TaskBuild)
        const expandedRows = ref([])

        const loading = ref(false)
        const changeDetected = ref(false)
        const toast = useToast()

        const editTitle = ref(false)
        const editSubtitle = ref(false)

        const showTaskModal = ref(false)
        function openTaskModal() {
            nextTick(() => {
                showTaskModal.value = true
            })
        }
        function closeTaskModal() {
            showTaskModal.value = false
            selectedTask.value = {} as TaskBuild
        }

        const subtaskParent = ref({} as TaskBuild)
        const showSubtaskModal = ref(false)
        function openSubtaskModal(data: TaskBuild) {
            subtaskParent.value = data
            nextTick(() => {
                showSubtaskModal.value = true
            })
        }
        function closeSubtaskModal() {
            showSubtaskModal.value = false
            selectedSubtask.value = {} as TaskBuild
        }

        const rowClass = (rowData) => {
            return rowData.tasks ? '' : 'no-expander'
        }

        const template = ref({} as Template)
        function getTemplate() {
            loading.value = true
            TemplateService.get(props.template_id)
                .then((res) => {
                    template.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Template', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Loading Template',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                    changeDetected.value = false
                })
        }
        getTemplate()

        function onTaskReorder(event) {
            template.value.data.tasks = event.value
            if (!changeDetected.value) changeDetected.value = true
        }

        function onSubtaskReorder(slug: string, event) {
            const idx = template.value.data.tasks.findIndex((t) => t.slug === slug)
            template.value.data.tasks[idx].tasks = event.value
            if (!changeDetected.value) changeDetected.value = true
        }

        function saveTask() {
            selectedTask.value.tasks?.forEach((task) => {
                task.gate = selectedTask.value.gate
            })
            // template.value is updated through v-model, so no need to find index and update
            if (!changeDetected.value) changeDetected.value = true
            closeTaskModal()
        }

        function saveSubtask() {
            const subgate = ref(subtaskParent.value.tasks ? subtaskParent.value.tasks[0].sub_gate : null as null|number)
            subtaskParent.value.palt_plan = 0
            subtaskParent.value.bus_days = 0
            subtaskParent.value.tasks?.forEach((task) => {
                if (task.sub_gate != subgate.value) subgate.value = null
                subtaskParent.value.palt_plan += task.palt_plan
                subtaskParent.value.bus_days += task.bus_days
            })
            subtaskParent.value.sub_gate = subgate.value

            if (!changeDetected.value) changeDetected.value = true
            closeSubtaskModal()
        }

        function saveTemplate() {
            // Generate slug before saving
            template.value.data.tasks.forEach((task: TaskBuild) => {
                task.slug = generateSlug(task.title.toString())

                if (task.tasks && task.tasks.length > 0) {
                    task.tasks.forEach((subtask) => {
                        subtask.slug = generateSlug(subtask.title.toString())
                    })
                }
            })
            loading.value = true
            TemplateService.update(props.template_id, template.value)
                .then((res) => {
                    template.value = res.data
                    toast.add({
                        severity: 'success',
                        summary: 'Saved',
                        detail: 'Template Updated',
                        life: 3000,
                    })
                })
                .catch((err) => {
                    console.warn('Error Saving Template', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Saving Template',
                        life: 3000,
                    })
                })
                .finally(() => {
                    loading.value = false
                    changeDetected.value = false
                })
        }

        return {
            loading,
            changeDetected,
            editTitle,
            editSubtitle,
            selectedTask,
            selectedSubtask,
            expandedRows,
            showTaskModal,
            openTaskModal,
            closeTaskModal,
            showSubtaskModal,
            openSubtaskModal,
            closeSubtaskModal,
            rowClass,
            onTaskReorder,
            onSubtaskReorder,
            getTemplate,
            saveTask,
            saveSubtask,
            saveTemplate,
            template,
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
