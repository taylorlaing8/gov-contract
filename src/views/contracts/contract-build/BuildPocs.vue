<template>
    <div class="p-fluid formgrid grid mb-6">
        <div class="col-12 mb-4">
            <h3>Points of Contact</h3>
        </div>
        <div class="field col-12">
            <label for="title">Assigned POCs</label>
            <MultiSelect
                v-model="details.pocs"
                :options="fPocs"
                display="chip"
                optionLabel="title"
                optionValue="value"
                :filter="true"
                :loading="fPocs.length <= 0"
            >
                <template #option="slotProps">
                    <div class="flex w-full justify-content-between">
                        <span>{{slotProps.option.title}}</span>
                        <span>{{slotProps.option.position}}</span>
                    </div>
                </template>
            </MultiSelect>
        </div>
        <div class="field col-12">
            <label for="title">SS Leads</label>
            <MultiSelect
                v-model="details.ss_leads"
                :options="filteredPocs()"
                display="chip"
                optionLabel="title"
                optionValue="value"
                :filter="true"
                :disabled="details.pocs.length <= 0"
            >
                <template #option="slotProps">
                    <div class="flex w-full justify-content-between">
                        <span>{{slotProps.option.title}}</span>
                        <span>{{slotProps.option.position}}</span>
                    </div>
                </template>
            </MultiSelect>
        </div>
    </div>
    <div class="p-fluid formgrid grid mb-6">
        <div class="col-12 mb-4">
            <h3>Lead POCs</h3>
        </div>
        <div class="field col-4">
            <label for="title">SSA</label>
            <Dropdown
                v-model="details.ssa"
                :options="filteredPocs()"
                :filter="true"
                optionLabel="title"
                optionValue="value"
                :disabled="details.pocs.length <= 0"
            ></Dropdown>
        </div>
        <div class="field col-4">
            <label for="title">CAA</label>
            <Dropdown
                v-model="details.caa"
                :options="filteredPocs()"
                :filter="true"
                optionLabel="title"
                optionValue="value"
                :disabled="details.pocs.length <= 0"
            ></Dropdown>
        </div>
        <div class="field col-4">
            <label for="title">SDO</label>
            <Dropdown
                v-model="details.sdo"
                :options="filteredPocs()"
                :filter="true"
                optionLabel="title"
                optionValue="value"
                :disabled="details.pocs.length <= 0"
            ></Dropdown>
        </div>
        <div class="field col-3">
            <label for="title">PCO</label>
            <Dropdown
                v-model="details.pco"
                :options="filteredPocs()"
                :filter="true"
                optionLabel="title"
                optionValue="value"
                :disabled="details.pocs.length <= 0"
            ></Dropdown>
        </div>
        <div class="field col-3">
            <label for="title">Admin PCO</label>
            <Dropdown
                v-model="details.admin_pco"
                :options="filteredPocs()"
                :filter="true"
                optionLabel="title"
                optionValue="value"
                :disabled="details.pocs.length <= 0"
            ></Dropdown>
        </div>
        <div class="field col-3">
            <label for="title">Buyer</label>
            <Dropdown
                v-model="details.buyer"
                :options="filteredPocs()"
                :filter="true"
                optionLabel="title"
                optionValue="value"
                :disabled="details.pocs.length <= 0"
            ></Dropdown>
        </div>
        <div class="field col-3">
            <label for="title">Admin Buyer</label>
            <Dropdown
                v-model="details.admin_buyer"
                :options="filteredPocs()"
                :filter="true"
                optionLabel="title"
                optionValue="value"
                :disabled="details.pocs.length <= 0"
            ></Dropdown>
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
import { defineComponent, PropType, ref, watch } from 'vue'
import type { ContractBuild, PointOfContact } from '@/types/ContractData.type'
import _ from 'lodash'
import { useToast } from 'primevue/usetoast'

import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import MultiSelect from 'primevue/multiselect'

import { PointOfContactService } from '@/api/ContractService'
import { formatPOC } from '@/composables/ContractCalcs.composable'

export default defineComponent({
    name: 'BuildPocs',
    
    props: {
        contract: {
            type: Object as PropType<ContractBuild>,
            required: true,
        },
    },

    components: {
        MultiSelect,
        Dropdown,
        Button,
    },

    emits: ['update_contract', 'prevPage', 'nextPage', 'complete'],
    
    setup(props, { emit }) {
        const toast = useToast()
        const details = ref(props.contract)
        
        const pocs = ref([] as PointOfContact[])
        const fPocs = ref([] as { value: number | null, title: string, position: string | null }[])
        const selectedPOCs = ref()

        function getPocs() {
            PointOfContactService.list()
                .then((res) => {
                    pocs.value = res.data
                })
                .then(() => {
                    fPocs.value = [
                        ...pocs.value.map((poc: PointOfContact) => {
                            return {
                                value: poc.id,
                                title: formatPOC(poc),
                                position: poc.title?.title || null
                            }
                        }),
                    ]
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

        const filteredPocs = () => {
            return fPocs.value.filter((poc) => {
                return poc.value ? details.value.pocs.includes(poc.value) : false
            })
        }
        
        function verifyPage() {
            if (details.value.pocs.length > 0 && details.value.ss_leads.length > 0 && details.value.ssa && details.value.caa && details.value.sdo && details.value.pco && details.value.buyer && details.value.admin_pco && details.value.admin_buyer) return true
            else return false
        }

        function prevPage() {
            emit('prevPage', details.value, 1)
        }

        function nextPage() {
            const verified = verifyPage()
            if (verified) emit('nextPage', details.value, 1)
            else {
                toast.add({
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Please verify all fields have been completed',
                    life: 3000,
                })
            }
        }

        return {
            details,
            selectedPOCs,
            fPocs,
            filteredPocs,
            prevPage,
            nextPage,
        }
    }
})

</script>

<style lang="scss">
.p-multiselect-label {
    white-space: normal !important;
}
.p-multiselect.p-multiselect-chip .p-multiselect-token {
    margin: 0.25rem !important;
    border-radius: 3px !important;
}
</style>