<template>
    <div class="grid align-items-center" v-if="templateData && templateData.data">
        <div class="col-9">
            <div class="flex align-items-center">
                <template v-if="!editTitle">
                    <h2 @click="editTitle = true">{{ templateData.title }}</h2>
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm hover-edit-btn ml-1" @click="editTitle = true"/>
                </template>
                <template v-else>
                    <InputText id="title" class="p-inputtext-lg w-full" v-model="templateData.title" />
                    <Button
                        icon="pi pi-times"
                        class="p-button-rounded p-button-text"
                        @click="cancelEdit('title')"
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
                    <p class="m-0" @click="editSubtitle = true">{{ templateData.sub_title ? templateData.sub_title : '-' }}</p>
                    <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-sm hover-edit-btn ml-1" @click="editSubtitle = true"/>
                </template>
                <template v-else>
                    <InputText id="title" class="p-inputtext-sm w-full" v-model="templateData.sub_title" />
                    <Button
                        icon="pi pi-times"
                        class="p-button-rounded p-button-text"
                        @click="cancelEdit('subtitle')"
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
                @click="cancelEdit"
            />
            <Button
                label="Save"
                icon="pi pi-check"
                class="p-button-success header-button"
                @click="saveTemplate"
            />
        </div>
        <div class="col-12 mt-4">
            <TemplateTable :templateTasks="templateData.data.tasks" :canEdit="true" @update_tasks="updateTasks" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { TemplateService } from '@/api/ContractService'
import type { TaskBuild, Template } from '@/types/ContractData.type'
import { useToast } from 'primevue/usetoast'
import _ from "lodash"

import TemplateTable from '@/components/TemplateTable.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

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
        InputText,
        TemplateTable,
    },

    setup(props) {
        const loading = ref(false)
        const changeDetected = ref(false)
        const toast = useToast()

        const template = ref({} as Template)
        const templateData = ref({} as Template)

        const editTitle = ref(false)
        const editSubtitle = ref(false)

        function updateTasks(data: TaskBuild[], changed: boolean) {
            templateData.value.data.tasks = data
            changeDetected.value = changeDetected.value ? changeDetected.value : changed
        }

        function cancelEdit(item?: string) {
            if(typeof item === 'string') {
                switch(item) {
                    case 'title':
                        editTitle.value = false
                        templateData.value.title = _.cloneDeep(template.value.title)
                        break
                    case 'subtitle':
                        editSubtitle.value = false
                        templateData.value.sub_title = _.cloneDeep(template.value.sub_title)
                        break
                }
            }
            else {
                templateData.value = _.cloneDeep(template.value)
                editTitle.value = false
                editSubtitle.value = false
                changeDetected.value = false
            }
        }

        function getTemplate() {
            loading.value = true
            TemplateService.get(props.template_id)
                .then((res) => {
                    template.value = res.data
                    templateData.value = _.cloneDeep(template.value)
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

        function saveTemplate() {
            loading.value = true

            TemplateService.update(props.template_id, templateData.value)
                .then((res) => {
                    template.value = res.data
                    templateData.value = _.cloneDeep(template.value)
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
                    editTitle.value = false
                    editSubtitle.value = false
                })
        }

        return {
            loading,
            changeDetected,
            editTitle,
            editSubtitle,
            updateTasks,
            templateData,
            getTemplate,
            cancelEdit,
            saveTemplate,
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
