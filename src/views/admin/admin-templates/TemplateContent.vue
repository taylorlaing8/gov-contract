<template>
    <div class="grid align-items-center" v-if="template && template.data">
        <div class="col-9">
            <h2 class="">{{ template.title }}</h2>
            <p class="m-0">
                {{ template.sub_title ? template.sub_title : '-' }}
            </p>
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
                @row-click="openEditModal"
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
                            @row-click="openEditModal"
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
        v-model:visible="showEditModal"
        :style="{ width: '700px' }"
        header="Edit Task"
        :modal="true"
        class="p-fluid"
        :closeOnEscape="true"
        :dismissableMask="true"
        :draggable="false"
        @hide="closeEditModal"
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
                <InputText id="gate" v-model="selectedTask.gate" />
            </div>
            <div class="field col-6">
                <label for="sub-gate">Sub Gate</label>
                <InputText id="sub-gate" v-model="selectedTask.sub_gate" />
            </div>
            <div class="field col-6">
                <label for="palt-plan">Palt Planned</label>
                <InputText id="palt-plan" v-model="selectedTask.palt_plan" />
            </div>
            <div class="field col-6">
                <label for="bus-days">Business Days</label>
                <InputText id="bus-days" v-model="selectedTask.bus_days" />
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
                    @click="closeEditModal"
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
import { defineComponent, nextTick, ref, watch } from 'vue'
import { TemplateService } from '@/api/ContractService'
import type { TaskBuild, Template } from '@/types/ContractData.type'
import { generateSlug } from '@/composables/ContractCalcs.composable'

import Button from 'primevue/button'
import Dialog from 'primevue/dialog'
import DataTable from 'primevue/datatable'
import Column from 'primevue/column'
import InputText from 'primevue/inputtext'

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
    },

    setup(props) {
        const selectedTask = ref({} as TaskBuild)
        const selectedSubtask = ref({} as TaskBuild)
        const expandedRows = ref([])

        const loading = ref(false)
        const changeDetected = ref(false)
        const toast = useToast()

        const showEditModal = ref(false)
        function openEditModal() {
            nextTick(() => {
                if(selectedSubtask.value.title) {
                    selectedTask.value = selectedSubtask.value
                }
                showEditModal.value = true
            })
        }
        function closeEditModal() {
            showEditModal.value = false
            selectedTask.value = selectedSubtask.value = {} as TaskBuild
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
            // template.value is updated through v-model, so no need to find index and update
            if (!changeDetected.value) changeDetected.value = true
            closeEditModal()
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
                })
        }

        return {
            loading,
            changeDetected,
            selectedTask,
            selectedSubtask,
            expandedRows,
            showEditModal,
            rowClass,
            openEditModal,
            closeEditModal,
            onTaskReorder,
            onSubtaskReorder,
            getTemplate,
            saveTask,
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
