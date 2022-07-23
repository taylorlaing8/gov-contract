<template>
    <div class="grid align-items-center" v-if="template && template.data">
        <div class="col-9">
            <div class="flex align-items-center">
                <template v-if="!editTitle">
                    <h2 class="">{{ template.title }}</h2>
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm hover-edit-btn ml-1" @click="editTitle = true"/>
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
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm hover-edit-btn ml-1" @click="editSubtitle = true"/>
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
                @row-click="openTaskModal()"
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
                            @row-click="openTaskModal(slotProps.data)"
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
                <InputNumber id="gate" v-model="modalTask.gate" showButtons :min="0" :max="4"/>
            </div>
            <div class="field col-6">
                <label for="sub-gate">Sub Gate</label>
                <InputNumber id="sub-gate" v-model="modalTask.sub_gate" showButtons :min="0" :max="5" :disabled="modalTask.tasks && modalTask.tasks.length > 0"/>
            </div>
            <div class="field col-6">
                <label for="palt-plan">Palt Planned</label>
                <InputNumber id="palt-plan" v-model="modalTask.palt_plan" :maxFractionDigits="1" showButtons mode="decimal" :min="0" :step="0.50" :disabled="modalTask.tasks && modalTask.tasks.length > 0"/>
            </div>
            <div class="field col-6">
                <label for="bus-days">Business Days</label>
                <InputNumber id="bus-days" v-model="modalTask.bus_days" :maxFractionDigits="1" showButtons mode="decimal" :min="0" :step="0.50" :disabled="modalTask.tasks && modalTask.tasks.length > 0"/>
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
import { defineComponent, nextTick, ref, watch } from 'vue'
import { TemplateService } from '@/api/ContractService'
import type { Link, TaskBuild, Template } from '@/types/ContractData.type'
import { generateSlug } from '@/composables/ContractCalcs.composable'
import _ from "lodash"

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
        const modalTask = ref({} as TaskBuild)
        const expandedRows = ref([])

        const loading = ref(false)
        const changeDetected = ref(false)
        const toast = useToast()

        const editTitle = ref(false)
        const editSubtitle = ref(false)

        const subtaskParent = ref({} as TaskBuild)
        const isSubtask = ref(false)
        const showTaskModal = ref(false)

        function openTaskModal(data?: TaskBuild) {
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
                }
            }

            closeTaskModal()
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
            modalTask,
            expandedRows,
            showTaskModal,
            openTaskModal,
            closeTaskModal,
            rowClass,
            onTaskReorder,
            onSubtaskReorder,
            addLink,
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
