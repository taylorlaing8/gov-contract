<template>
    <div class="p-fluid formgrid grid mb-6">
        <div class="field col-12">
            <label for="title">Select Template</label>
            <Dropdown
                v-model="selectedTemplate"
                :options="templates"
                :filter="true"
                optionLabel="title"
            ></Dropdown>
        </div>
    </div>
    <div class="p-fluid formgrid grid mb-6">
        <div class="col-12 mb-4">
            <h3>Task Schedule</h3>
        </div>
        <div class="field col-12" v-if="selectedTemplate.id">
            <TemplateTable :templateTasks="selectedTemplate.data.tasks" :canEdit="true" @update_tasks="updateTasks" />
        </div>
    </div>
    <div class="grid">
        <div class="col-6 text-left">
            <Button label="Previous" class="p-button-outlined w-7rem" @click="prevPage" />
        </div>
        <div class="col-6 text-right">
            <Button label="Next" class="p-button-outlined w-7rem" @click="nextPage" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import type { ContractBuild, TaskBuild, Template } from '@/types/ContractData.type'
import _ from 'lodash'
import { useToast } from 'primevue/usetoast'
import { TemplateService } from '@/api/ContractService'
import TemplateTable from '@/components/TemplateTable.vue'

import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'

export default defineComponent({
    name: 'BuildSchedule',
    
    props: {
        contract: {
            type: Object as PropType<ContractBuild>,
            required: true,
        },
    },

    components: {
        TemplateTable,
        Dropdown,
        Button,
    },

    emits: ['update_contract', 'prevPage', 'nextPage', 'complete'],
    
    setup(props, { emit }) {
        const toast = useToast()
        const details = ref(props.contract)
        const templates = ref([] as Template[])
        const selectedTemplate = ref({} as Template)

        function getTemplates() {
            TemplateService.list()
                .then((res) => {
                    templates.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Templates', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Loading Templates',
                        life: 3000,
                    })
                })
        }
        getTemplates()

        function updateTasks(data: TaskBuild[], changed: boolean) {
            selectedTemplate.value.data.tasks = data
        }

        function verifyPage() {
            let verified = false
            if (selectedTemplate.value.id) {
                verified = true
                const gatePalts = [ details.value.g_o_p, details.value.g_t_p, details.value.g_tr_p, (details.value.g_fr_o_p + details.value.g_fr_t_p + details.value.g_fr_tr_p + details.value.g_fr_fr_p + details.value.g_fr_fv_p) ]
                const templatePalts = [ 0, 0, 0, 0 ]

                selectedTemplate.value.data.tasks.forEach((task) => {
                    templatePalts[task.gate - 1] += task.palt_plan
                })

                templatePalts.forEach((val, idx) => {
                    if (val !== gatePalts[idx]) {
                        verified = false
                        toast.add({
                            severity: 'error',
                            summary: 'Error',
                            detail: `Palt Planned Mismatch: Gate ${idx + 1} (${val} / ${gatePalts[idx]})`,
                            life: 5000,
                        })
                    }
                })
            }

            return verified
        }

        function prevPage() {
            emit('prevPage', details.value, 2)
        }

        function nextPage() {
            const verified = verifyPage()

            if (verified) {
                details.value.tasks = selectedTemplate.value.data.tasks
                emit('nextPage', details.value, 2)
            }
        }

        return {
            details,
            selectedTemplate,
            templates,
            updateTasks,
            prevPage,
            nextPage,
        }
    }
})

</script>

<style scoped lang="scss">
//
</style>