<template>
    <div class="loading" v-if="loading">
        <ProgressSpinner />
    </div>
     <div class="content-wrapper py-5" :style="loading ? 'filter: blur(2px);' : ''">
        <div class="grid justify-content-center">
            <div class="contract-build-wrapper col-11 px-5 py-4 bg-white border-1 surface-border border-round-sm">
                <div class="grid align-items-center">
                    <div class="col-12 text-center">
                        <h1>Contract Builder</h1>
                    </div>
                    <div class="col-12 mt-2">
                        <Steps :model="buildSteps" :readonly="false">
                            <template #item="{item}">
                                <router-link :to="item.to" custom v-slot="{ isExactActive }">
                                    <div class="flex flex-column align-items-center" :class="{ 'active-link': isExactActive}">
                                        <Button :icon="item.icon" class="p-button-rounded p-button-sm" :class="isExactActive ? 'p-button' : item.complete ? 'p-button-success' : 'p-button-outlined p-button-grey bg-white'" @click.prevent="openStep(item)"/>
                                        <span class="mt-2 mb-1" :class="isExactActive ? 'text-primary' : item.complete ? 'text-green-600' : 'text-600'">{{ item.label }}</span>
                                    </div>
                                </router-link>
                            </template>
                        </Steps>
                    </div>
                    <div class="col-12 mt-6">
                        <router-view v-slot="{Component}" :contract="contract" @prevPage="prevPage" @nextPage="nextPage" @complete="complete">
                            <keep-alive>
                                <component :is="Component" />
                            </keep-alive>
                        </router-view>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref, onBeforeMount } from 'vue'
import { contractBase } from '@/views/contracts/cTemplates/ContractBase'
import router from '@/router'
import { useRoute } from 'vue-router'
import { ymdDateFormat } from '@/composables/ContractCalcs.composable'
import type { ContractBuild } from '@/types/ContractData.type'
import { ContractService } from '@/api/ContractService'

import { useToast } from 'primevue/usetoast'

import ProgressSpinner from 'primevue/progressspinner'
import Steps from 'primevue/steps'
import Button from 'primevue/button'
import _ from 'lodash'

interface BuildStep {
    step: number,
    label: string,
    to: string,
    icon: string,
    complete: boolean
}

export default defineComponent({
    name: 'BuildWrapper',

    components: {
        ProgressSpinner,
        Steps,
        Button,
    },
    
    setup() {
        const toast = useToast()
        const route = useRoute()
        const loading = ref(false)

        const buildSteps = ref([
            {
                step: 0,
                label: 'Details',
                to: "/contracts/create",
                icon: 'pi pi-list',
                complete: false,
            },
            {
                step: 1,
                label: 'POCs',
                to: "/contracts/create/pocs",
                icon: 'pi pi-user',
                complete: false,
            },
            {
                step: 2,
                label: 'Schedule',
                to: "/contracts/create/schedule",
                icon: 'pi pi-calendar',
                complete: false,
            },
            {
                step: 3,
                label: 'Confirmation',
                to: "/contracts/create/confirm",
                icon: 'pi pi-check',
                complete: false,
            }
        ] as BuildStep[])

        // ADD THIS BACK TO ROUTE TO THE BEGINNING
        onBeforeMount(() => {
            if (buildSteps.value[0].to !== route.path) {
                toast.add({
                    severity: 'warn',
                    summary: 'Warning',
                    detail: 'Please Complete Previous Steps First',
                    life: 3000,
                })
                router.push(buildSteps.value[0].to)
                contract.value = { ...contractBase }
            }
        })

        const currPage = ref(0)
        const contract = ref({ ...contractBase } as ContractBuild)

        function openStep(step: BuildStep) {
            const idx = buildSteps.value.indexOf(step)

            if (idx === 0) {
                currPage.value = idx
                router.push(step.to)
            }
            else if (currPage.value !== idx && buildSteps.value[idx - 1].complete) {
                currPage.value = idx
                router.push(step.to)
            }
        }

        function nextPage(data: ContractBuild, step: number) {
            currPage.value = step + 1
            contract.value = data
            buildSteps.value[step].complete = true

            router.push(buildSteps.value[currPage.value].to)
        }

        function prevPage(data: ContractBuild, step: number) {
            currPage.value = step - 1
            contract.value = data

            router.push(buildSteps.value[currPage.value].to)
        }

        function complete() {
            loading.value = true

            let data = _.cloneDeep(contract.value)
            data = {
                ...data,
                need_date: ymdDateFormat(data.need_date),
                award_date: ymdDateFormat(data.award_date),
                start_date: ymdDateFormat(data.start_date),
                pop_date: ymdDateFormat(data.pop_date),
            }

            ContractService.create(data)
                .then((res) => {
                    toast.add({
                        severity: 'success',
                        summary: 'Created',
                        detail: 'Contract Created Successfully',
                        life: 3000,
                    })
                    return res.data
                })
                .then((data) => {
                    loading.value = false
                    router.push({
                        name: 'contract-overview',
                        params: {
                            contract_id: data.id.toString(),
                        },
                    })
                })
                .catch((err) => {
                    console.warn('Error Creating Contract', err)
                    toast.add({
                        severity: 'error',
                        summary: 'Error',
                        detail: 'Error Creating Contract',
                        life: 3000,
                    })
                })
        }

        return {
            loading,
            buildSteps,
            contract,
            openStep,
            prevPage,
            nextPage,
            complete,
        }
    }
})

</script>

<style lang="scss" scoped>
.loading {
    position: fixed;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    display: flex;
    align-items: center;
    background: #ffffff99;
    z-index: 99;
}

.contract-build-wrapper {
    max-width: 1100px;

    .link-complete-false {
        &:hover {
            cursor: pointer;
        }
    }
}
</style>