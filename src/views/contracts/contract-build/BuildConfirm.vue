<template>
    <div class="grid mb-6">
        <div class="col-12">
            <h3>Details</h3>
        </div>
        <div class="col-12">
            <p>
                Title
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.title }}
                </span>
            </p>
        </div>
        <div class="col-12">
            <p>
                Subtitle
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.sub_title }}
                </span>
            </p>
        </div>
        <div class="col-12">
            <p>
                UCID
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.ucid }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Value
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    ${{ contract.value }}&nbsp;M
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Type
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.type }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Code
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ cycleCodeString(contract, contract.cycle_code) }}
                </span>
            </p>
        </div>
    </div>
    <div class="grid mb-6">
        <div class="col-12">
            <h3>Gate Timeline</h3>
        </div>
        <div class="col-4">
            <p>
                Gate 1
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.g_o_p }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Gate 2
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.g_t_p }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Gate 3
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.g_tr_p }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Gate 4 - 1
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.g_fr_o_p }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Gate 4 - 2
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.g_fr_t_p }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Gate 4 - 3
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.g_fr_tr_p }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Gate 4 - 4
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.g_fr_fr_p }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Gate 4 - 5
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ contract.g_fr_fv_p }}
                </span>
            </p>
        </div>
    </div>
    <div class="grid mb-6">
        <div class="col-12">
            <h3>Important Dates</h3>
        </div>
        <div class="col-4">
            <p>
                Start Date
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ dateString(contract.start_date) }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Awarded Date
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ dateString(contract.award_date) }}
                </span>
            </p>
        </div>
        <div class="col-4"></div>
        <div class="col-4">
            <p>
                Need Date
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ dateString(contract.need_date) }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                POP Date
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ dateString(contract.pop_date) }}
                </span>
            </p>
        </div>
    </div>
    <div class="grid mb-6" v-if="pocs.length > 0">
        <div class="col-12">
            <h3>Points of Contact</h3>
        </div>
        <div class="col-12">
            <p>Assigned POCs</p>
            <Chip v-for="poc in contract.pocs" :key="poc" :label="formatPOC(findPoc(poc))" class="border-round-xs surface-800 text-white mr-1 my-2"/>
        </div>
        <div class="col-12">
            <p>SS Leads</p>
            <Chip v-for="poc in contract.ss_leads" :key="poc" :label="formatPOC(findPoc(poc))" class="border-round-xs surface-800 text-white mr-1 my-2"/>
        </div>
    </div>
    <div class="grid mb-6" v-if="pocs.length > 0">
        <div class="col-12">
            <h3>Lead POCs</h3>
        </div>
        <div class="col-4">
            <p>
                SSA
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ formatPOC(findPoc(contract.ssa)) }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                CAA
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ formatPOC(findPoc(contract.caa)) }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                SDO
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ formatPOC(findPoc(contract.sdo)) }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                PCO
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ formatPOC(findPoc(contract.pco)) }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Admin PCO
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ formatPOC(findPoc(contract.admin_pco)) }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Buyer
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ formatPOC(findPoc(contract.buyer)) }}
                </span>
            </p>
        </div>
        <div class="col-4">
            <p>
                Admin Buyer
                <span class="border-round surface-800 text-white ml-3 mr-1 px-3 py-2" >
                    {{ formatPOC(findPoc(contract.admin_buyer)) }}
                </span>
            </p>
        </div>
    </div>
    <div class="grid mb-6">
        <div class="col-12">
            <h3>Task Schedule</h3>
        </div>
        <div class="col-12">
            <TemplateTable :templateTasks="contract.tasks" />
        </div>
    </div>
    <div class="grid">
        <div class="col-6 text-left">
            <Button label="Previous" class="p-button-outlined w-7rem" @click="prevPage" />
        </div>
        <div class="col-6 text-right">
            <Button label="Confirm" class="p-button-success w-7rem" @click="complete" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref } from 'vue'
import type { ContractBuild, PointOfContact } from '@/types/ContractData.type'
import _ from 'lodash'
import { useToast } from 'primevue/usetoast'
import { cycleCodeString, dateString, formatDate, formatPOC } from '@/composables/ContractCalcs.composable'
import { PointOfContactService } from '@/api/ContractService'

import Button from 'primevue/button'
import Chip from 'primevue/chip'
import TemplateTable from '@/components/TemplateTable.vue'

export default defineComponent({
    name: 'BuildConfirm',
    
    props: {
        contract: {
            type: Object as PropType<ContractBuild>,
            required: true,
        },
    },

    components: {
        Button,
        Chip,
        TemplateTable,
    },

    emits: ['update_contract', 'prevPage', 'nextPage', 'complete'],
    
    setup(props, { emit }) {
        const toast = useToast()
        const pocs = ref([] as PointOfContact[])

        const findPoc = (id: number) => {
            return pocs.value.find((poc) => poc.id === id)
        }

        function getPocs() {
            PointOfContactService.list()
                .then((res) => {
                    pocs.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Team Members', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Loading Team Members',
                        life: 3000,
                    })
                })
        }
        getPocs()

        function prevPage() {
            emit('prevPage')
        }

        function complete() {
            emit('complete')
        }

        return {
            cycleCodeString,
            dateString,
            formatDate,
            pocs,
            findPoc,
            formatPOC,
            prevPage,
            complete,
        }
    }
})

</script>

<style scoped lang="scss">
//
</style>