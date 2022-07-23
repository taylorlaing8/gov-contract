<template>
    <div class="p-fluid formgrid grid mb-6">
        <div class="col-12 mb-4">
            <h3>Details</h3>
        </div>
        <div class="field col-6">
            <label for="title">Title</label>
            <InputText id="title" v-model="details.title" />
        </div>
        <div class="field col-6">
            <label for="subtitle">Subtitle</label>
            <InputText id="subtitle" v-model="details.sub_title" />
        </div>
        <div class="field col-12">
            <label for="ucid">UCID</label>
            <InputText id="ucid" v-model="details.ucid" />
        </div>
        <div class="field col-4">
            <label for="value">Value</label>
            <InputNumber
                id="value"
                v-model="details.value"
                :maxFractionDigits="2"
                showButtons
                mode="decimal"
                :step="0.25"
                :min="0"
            />
        </div>
        <div class="field col-4">
            <label for="type">Type</label>
            <Dropdown
                v-model="details.type"
                :options="contractCycles.types"
                optionValue="title"
                placeholder="Select Type"
            >
                <template #value="slotProps">
                    {{ slotProps.value || '-' }}
                </template>
                <template #option="slotProps">
                    {{ slotProps.option.title }}
                </template>
            </Dropdown>
        </div>
        <div class="field col-4">
            <label for="code">Code</label>
            <Dropdown
                v-model="details.cycle_code"
                :options="getCycleCodes()"
                optionValue="code"
                :disabled="details.type.length <= 0"
            >
                <template #value="slotProps">
                    {{ cycleCodeString(details, slotProps.value) || '-' }}
                </template>
                <template #option="slotProps">
                    {{ `${slotProps.option?.code} (${slotProps.option?.sub_title})` }}
                </template>
            </Dropdown>
        </div>
    </div>
    <div class="p-fluid formgrid grid mb-6">
        <div class="col-12 mb-4">
            <h3>Gate Timeline</h3>
        </div>
        <div class="field col-2">
            <label for="gate-one">Gate 1</label>
            <InputNumber
                id="gate-one"
                v-model="details.g_o_p"
                showButtons
                mode="decimal"
                :step="1"
                :min="0"
                :disabled="!details.cycle_code"
            />
        </div>
        <div class="field col-2">
            <label for="gate-two">Gate 2</label>
            <InputNumber
                id="gate-two"
                v-model="details.g_t_p"
                showButtons
                mode="decimal"
                :step="1"
                :min="0"
                :disabled="!details.cycle_code"
            />
        </div>
        <div class="field col-2">
            <label for="gate-three">Gate 3</label>
            <InputNumber
                id="gate-three"
                v-model="details.g_tr_p"
                showButtons
                mode="decimal"
                :step="1"
                :min="0"
                :disabled="!details.cycle_code"
            />
        </div>
        <div class="col-6"></div>
        <div class="field col-2">
            <label for="gate-four-one">Gate 4 - 1</label>
            <InputNumber
                id="gate-four-one"
                v-model="details.g_fr_o_p"
                showButtons
                mode="decimal"
                :step="1"
                :min="0"
                :disabled="!details.cycle_code"
            />
        </div>
        <div class="field col-2">
            <label for="gate-four-two">Gate 4 - 2</label>
            <InputNumber
                id="gate-four-two"
                v-model="details.g_fr_t_p"
                showButtons
                mode="decimal"
                :step="1"
                :min="0"
                :disabled="!details.cycle_code"
            />
        </div>
        <div class="field col-2">
            <label for="gate-four-three">Gate 4 - 3</label>
            <InputNumber
                id="gate-four-three"
                v-model="details.g_fr_tr_p"
                showButtons
                mode="decimal"
                :step="1"
                :min="0"
                :disabled="!details.cycle_code"
            />
        </div>
        <div class="field col-2">
            <label for="gate-four-four">Gate 4 - 4</label>
            <InputNumber
                id="gate-four-four"
                v-model="details.g_fr_fr_p"
                showButtons
                mode="decimal"
                :step="1"
                :min="0"
                :disabled="!details.cycle_code"
            />
        </div>
        <div class="field col-2">
            <label for="gate-four-five">Gate 4 - 5</label>
            <InputNumber
                id="gate-four-five"
                v-model="details.g_fr_fv_p"
                showButtons
                mode="decimal"
                :step="1"
                :min="0"
                :disabled="!details.cycle_code"
            />
        </div>
    </div>
    <div class="p-fluid formgrid grid mb-6">
        <div class="col-12 mb-4">
            <h3>Important Dates</h3>
        </div>
        <div class="field col-6">
            <label for="start-date">Start Date</label>
            <Calendar id="start-date" v-model="details.start_date" :showIcon="true" />
        </div>
        <div class="field col-6">
            <label for="award-date">Awarded Date</label>
            <Calendar id="award-date" v-model="details.award_date" :showIcon="true" />
        </div>
        <div class="field col-6">
            <label for="need-date">Need Date</label>
            <Calendar id="need-date" v-model="details.need_date" :showIcon="true" />
        </div>
        <div class="field col-6">
            <label for="pop-date">POP Date</label>
            <Calendar id="pop-date" v-model="details.pop_date" :showIcon="true" />
        </div>
    </div>
    <div class="grid">
        <div class="col-12 text-right">
            <Button label="Next" class="p-button-outlined w-7rem" @click="nextPage" />
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, PropType, ref, watch } from 'vue'
import type { ContractBuild } from '@/types/ContractData.type'
import contractCycles from '@/views/contracts/cTemplates/ContractCycles'
import _ from 'lodash'
import { useToast } from 'primevue/usetoast'

import InputText from 'primevue/inputtext'
import InputNumber from 'primevue/inputnumber'
import Dropdown from 'primevue/dropdown'
import Button from 'primevue/button'
import Calendar from 'primevue/calendar'
import { generateSlug, cycleCodeString } from '@/composables/ContractCalcs.composable'

export default defineComponent({
    name: 'BuildDetails',

    props: {
        contract: {
            type: Object as PropType<ContractBuild>,
            required: true,
        },
    },

    components: {
        InputText,
        InputNumber,
        Dropdown,
        Button,
        Calendar,
    },

    emits: ['update_contract', 'prevPage', 'nextPage', 'complete'],
    
    setup(props, { emit }) {
        const toast = useToast()
        const details = ref(props.contract)

        function getCycleCodes() {
            return contractCycles.types.find((type) => {
                return type.title === details.value.type
            })?.value
        }

        watch(() => details.value.type, (newData, oldData) => {
            if (newData !== oldData) details.value.cycle_code = null
        })

        watch(() => details.value.cycle_code, (newData, oldData) => {
            if (newData) {
                const cycleData = getCycleCodes()?.find((cycle) => cycle.code === details.value.cycle_code)
                details.value.g_o_p = contractCycles.g_o_p
                details.value.g_t_p = contractCycles.g_t_p
                details.value.g_tr_p = contractCycles.g_tr_p
                details.value.g_fr_o_p = cycleData?.g_fr_o_p || 0
                details.value.g_fr_t_p = cycleData?.g_fr_t_p || 0
                details.value.g_fr_tr_p = cycleData?.g_fr_tr_p || 0
                details.value.g_fr_fr_p = cycleData?.g_fr_fr_p || 0
                details.value.g_fr_fv_p = cycleData?.g_fr_fv_p || 0
            }
        })

        function verifyPage() {
            if (details.value.title.length > 0 && details.value.ucid.length > 0 && details.value.value > 0 && details.value.type.length > 0 && details.value.cycle_code && details.value.start_date && details.value.award_date && details.value.need_date && details.value.pop_date) return true
            else return false
        }

        function nextPage() {
            details.value.slug = generateSlug(`${details.value.ucid} ${details.value.title}`)
            details.value.cycle_code = details.value.cycle_code ? details.value.cycle_code.split(' ')[0] : ''

            const verified = verifyPage()
            if (verified) emit('nextPage', details.value, 0)
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
            contractCycles,
            cycleCodeString,
            getCycleCodes,
            nextPage,
        }
    }
})

</script>

<style scoped lang="scss">
//
</style>