<template>
    <div class="contract-content-wrapper pb-8">
        <v-row class="justify-center py-5" :no-gutters="true">
            <v-col cols="7">
                <v-card class="px-8 py-5" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <h5 class="text-h5">Contract Builder</h5>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="justify-center py-2" :no-gutters="true">
            <v-col cols="7">
                <v-card class="pa-8" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <v-text-field
                                color="primary"
                                label="Title"
                                variant="outlined"
                                density="compact"
                                bg-color="white"
                                :hide-details="true"
                                v-model="contract.title"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="12">
                            <v-text-field
                                color="primary"
                                label="Subtitle"
                                variant="outlined"
                                density="compact"
                                bg-color="white"
                                :hide-details="true"
                                v-model="contract.sub_title"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                color="primary"
                                label="UCID"
                                variant="outlined"
                                density="compact"
                                bg-color="white"
                                :hide-details="true"
                                v-model="contract.ucid"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-text-field
                                color="primary"
                                label="Value"
                                variant="outlined"
                                density="compact"
                                bg-color="white"
                                prefix="$"
                                suffix="M"
                                :hide-details="true"
                                v-model="contract.value"
                            ></v-text-field>
                        </v-col>
                        <v-col cols="6">
                            <v-select
                                :items="contractCycles.types"
                                item-value="title"
                                item-title="title"
                                color="primary"
                                label="Type"
                                v-model="contract.type"
                                variant="outlined"
                                density="compact"
                                :hide-details="true"
                            ></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-select
                                :items="getCycleCodes()"
                                item-value="id"
                                item-title="title"
                                color="primary"
                                label="Cycle Code"
                                v-model="contract.cycle_code"
                                variant="outlined"
                                density="compact"
                                :disabled="typeof getCycleCodes() === 'undefined'"
                                :hide-details="true"
                            >
                                <template v-slot:selection="{ item }">
                                    <div class="d-flex align-end">
                                        <span>{{ item.title }}</span>
                                        <span class="text-caption ml-2">({{ item.sub_title }})</span>
                                    </div>
                                </template>
                            </v-select>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="justify-center py-2" :no-gutters="true">
            <v-col cols="7">
                <v-card class="pa-8" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="6">
                            <DatePicker v-model="contract.start_date">
                                <template v-slot="{ inputValue, inputEvents }">
                                    <v-text-field
                                        color="primary"
                                        label="Start Date"
                                        variant="outlined"
                                        density="compact"
                                        :hide-details="true"
                                        v-model="contract.start_date"
                                        :value="inputValue"
                                        v-on="inputEvents"
                                    ></v-text-field>
                                </template>
                            </DatePicker>
                        </v-col>
                        <v-col cols="6">
                            <DatePicker v-model="contract.need_date">
                                <template v-slot="{ inputValue, inputEvents }">
                                    <v-text-field
                                        color="primary"
                                        label="Need Date"
                                        variant="outlined"
                                        density="compact"
                                        :hide-details="true"
                                        v-model="contract.need_date"
                                        :value="inputValue"
                                        v-on="inputEvents"
                                    ></v-text-field>
                                </template>
                            </DatePicker>
                        </v-col>
                        <v-col cols="6">
                            <DatePicker v-model="contract.award_date">
                                <template v-slot="{ inputValue, inputEvents }">
                                    <v-text-field
                                        color="primary"
                                        label="Award Date"
                                        variant="outlined"
                                        density="compact"
                                        :hide-details="true"
                                        v-model="contract.award_date"
                                        :value="inputValue"
                                        v-on="inputEvents"
                                    ></v-text-field>
                                </template>
                            </DatePicker>
                        </v-col>
                        <v-col cols="6">
                            <DatePicker v-model="contract.pop_date">
                                <template v-slot="{ inputValue, inputEvents }">
                                    <v-text-field
                                        color="primary"
                                        label="POP Date"
                                        variant="outlined"
                                        density="compact"
                                        :hide-details="true"
                                        v-model="contract.pop_date"
                                        :value="inputValue"
                                        v-on="inputEvents"
                                    ></v-text-field>
                                </template>
                            </DatePicker>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="justify-center py-2" :no-gutters="true">
            <v-col cols="7">
                <v-card class="pa-8" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <v-select
                                :items="pocs"
                                item-value="id"
                                item-title="title"
                                color="primary"
                                label="Team Members"
                                v-model="contract.pocs"
                                variant="outlined"
                                density="compact"
                                multiple
                                chips
                                @update:modelValue="updatePocList()"
                                :hide-details="true"
                            >
                                <template v-slot:selection="{ item }">
                                    {{ item }} !!!
                                </template>
                                <template v-slot:item="{ item }">
                                    {{ item }} !!!
                                </template>
                            </v-select>
                        </v-col>
                        <v-col cols="12">
                            <v-select
                                :items="pocList"
                                item-value="id"
                                item-title="title"
                                color="primary"
                                label="SS Leads"
                                v-model="contract.ss_leads"
                                variant="outlined"
                                density="compact"
                                :disabled="pocList.length <= 0"
                                multiple
                                chips
                                :hide-details="true"
                            ></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-select
                                :items="pocList"
                                item-value="id"
                                item-title="title"
                                color="primary"
                                label="PCO"
                                v-model="contract.pco"
                                variant="outlined"
                                density="compact"
                                :disabled="pocList.length <= 0"
                                :hide-details="true"
                            ></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-select
                                :items="pocList"
                                item-value="id"
                                item-title="title"
                                color="primary"
                                label="Buyer"
                                v-model="contract.buyer"
                                variant="outlined"
                                density="compact"
                                :disabled="pocList.length <= 0"
                                :hide-details="true"
                            ></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-select
                                :items="pocList"
                                item-value="id"
                                item-title="title"
                                color="primary"
                                label="Admin PCO"
                                v-model="contract.admin_pco"
                                variant="outlined"
                                density="compact"
                                :disabled="pocList.length <= 0"
                                :hide-details="true"
                            ></v-select>
                        </v-col>
                        <v-col cols="6">
                            <v-select
                                :items="pocList"
                                item-value="id"
                                item-title="title"
                                color="primary"
                                label="Admin Buyer"
                                v-model="contract.admin_buyer"
                                variant="outlined"
                                density="compact"
                                :disabled="pocList.length <= 0"
                                :hide-details="true"
                            ></v-select>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { PointOfContactService, TemplateService } from '@/api/ContractService'
import type { PointOfContact, Template } from '@/types/ContractData.type'
import { defineComponent, ref } from 'vue'
import { contractBase } from '@/views/contracts/cTemplates/ContractBase'
import contractCycles from '@/views/contracts/cTemplates/ContractCycles'
import { generateSlug } from '@/composables/ContractCalcs.composable'
import { DatePicker } from 'v-calendar'

export default defineComponent({
    name: 'ContractBuilder',

    components: {
        DatePicker,
    },
    
    emits: ['loading-change'],
    
    setup(props , { emit }) {
        const loading = ref(false)
        const contract = ref({
            ...contractBase,
        })

        // g_o_p: 0,
        // g_t_p: 0,
        // g_tr_p: 0,
        // g_fr_o_p: 0,
        // g_fr_t_p: 0,
        // g_fr_tr_p: 0,
        // g_fr_fr_p: 0,
        // g_fr_fv_p: 0,

        // tasks: [] as TaskBuild[],

        const templates = ref([] as Template[])
        function getTemplates() {
            loading.value = true
            emit('loading-change', true)
            TemplateService.list()
                .then((res) => {
                    templates.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Templates', err)
                })
                .finally(() => {
                    loading.value = false
                    emit('loading-change', false)
                })
        }
        getTemplates()

        const pocs = ref([] as PointOfContact[])
        function getPocs() {
            loading.value = true
            emit('loading-change', true)
            PointOfContactService.list()
                .then((res) => {
                    pocs.value = res.data.map((poc) => {
                        const prefix = poc.prefix ? `${poc.prefix}. ` : ''
                        return {
                            title: `${prefix}${poc.first_name} ${poc.last_name}`,
                            id: poc.id,
                        }
                    })
                })
                .catch((err) => {
                    console.warn('Error Fetching Team Members')
                })
                .finally(() => {
                    loading.value = false
                    emit('loading-change', false)
                })
        }
        getPocs()

        const pocList = ref([] as PointOfContact[])
        function updatePocList() {
            pocList.value = pocs.value.filter((poc) => {
                return contract.value.pocs.includes(poc.id)
            })

        }

        function getCycleCodes() {
            return contractCycles.types.find((type) => {
                return type.title === contract.value.type
            })?.value
        }

        function createContract() {
            const data = {
                ...contract.value,
                slug: generateSlug(contract.value.title),
                status: 'IC',

            }
        }

        return {
            contract, templates, pocs, pocList, updatePocList,
            contractCycles, getCycleCodes,
        }
    }
        // return {
        //     "title": "Overhead Production Services",
        //     "sub_title": null,
        //     "slug": "overhead-production-services",
        //     "ucid": "FA822422R0006",
        //     "type": "Source Selection",
        //     "cycle_code": "3",
        //     // "status": "IC", defaulted to IC
        //     "value": 485.0,
        //     "need_date": "2022-06-14",
        //     "award_date": "2022-02-07",
        //     "start_date": "2020-11-17",
        //     "pop_date": "2022-11-17",


        //     "pocs": [
        //         1,
        //         3
        //     ],

        //     "ss_leads": [
        //         1
        //     ],
        //     "pco": 3,
        //     "buyer": 3,
        //     "admin_pco": 3,
        //     "admin_buyer": 1,

        //     "g_o_p": 60,
        //     "g_t_p": 15,
        //     "g_tr_p": 577,
        //     "g_fr_o_p": 90,
        //     "g_fr_t_p": 30,
        //     "g_fr_tr_p": 120,
        //     "g_fr_fr_p": 150,
        //     "g_fr_fv_p": 10,
        // }
    // }
})

</script>

<style lang="scss" scoped>
//
</style>