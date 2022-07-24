<template>
    <div class="grid mb-6">
        <div class="col-6 mb-4">
            <h3>Template Builder</h3>
        </div>
        <div class="col-6 text-right">
            <router-link to="/admin/templates">
                <Button
                    label="Cancel"
                    icon="pi pi-times"
                    class="p-button-text mr-4"
                />
            </router-link>
            <Button
                label="Create"
                icon="pi pi-check"
                class="p-button-success header-button"
                @click="createTemplate"
            />
        </div>
        <div class="field col-6">
            <label for="title">Title</label>
            <InputText id="title" class="w-full" v-model="template.title" />
        </div>
        <div class="field col-6">
            <label for="subtitle">Subtitle</label>
            <InputText id="subtitle" class="w-full" v-model="template.sub_title" />
        </div>
        <div class="field col-12 mt-4">
            <TemplateTable :templateTasks="template.data.tasks" :canEdit="true" @update_tasks="updateTasks" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'
import { TemplateService } from '@/api/ContractService'
import type { TaskBuild, Template } from '@/types/ContractData.type'
import { generateSlug } from '@/composables/ContractCalcs.composable'
import router from '@/router'
import { useToast } from 'primevue/usetoast'

import TemplateTable from '@/components/TemplateTable.vue'
import Button from 'primevue/button'
import InputText from 'primevue/inputtext'

export default defineComponent({
    name: 'TemplateBuilder',

    components: {
        Button,
        InputText,
        TemplateTable,
    },

    setup() {
        const toast = useToast()

        const template = ref({
            title: '',
            sub_title: null,
            data: {
                tasks: [
                    {
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
                ]
            }
        } as Template)

        function updateTasks(data: TaskBuild[], changed: boolean) {
            template.value.data.tasks = data
        }

        function createTemplate() {
            TemplateService.create(template.value)
                .then((res) => {
                    toast.add({
                        severity: 'success',
                        summary: 'Created',
                        detail: 'Template Created',
                        life: 3000,
                    })
                    router.push({
                        name: 'template-content',
                        params: {
                            template_id: res.data.id
                        },
                    })
                })
                .catch((err) => {
                    console.warn('Error Saving Template', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Creating Template',
                        life: 3000,
                    })
                })
        }

        return {
            template,
            updateTasks,
            createTemplate,
        }
    }
})

</script>

<style lang="scss" scoped>
//
</style>