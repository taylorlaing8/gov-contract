<template>
    <div class="contract-content-wrapper">
        <v-row class="justify-center" :no-gutters="true">
            <v-col cols="11">
                <v-card class="px-8 py-5 my-5" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <h5 class="text-h5">{{ nav.title }}</h5>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card
                    class="px-8 py-5 my-5"
                    elevation="2"
                >
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <table>
                                <thead>
                                    <tr>
                                        <th class="text-left">Prefix</th>
                                        <th class="text-left">First Name</th>
                                        <th class="text-left">Last Name</th>
                                        <th class="text-left">Email</th>
                                        <th class="text-left">Position</th>
                                        <th></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template
                                        v-for="(poc, idx) in pocs"
                                        :key="poc.id"
                                    >
                                        <tr v-if="edit.includes(poc.id)">
                                            <td width="7%">
                                                <v-text-field
                                                    color="primary"
                                                    label="Prefix"
                                                    variant="outlined"
                                                    density="compact"
                                                    :hide-details="true"
                                                    :disabled="loading"
                                                    v-model="poc.prefix"
                                                ></v-text-field>
                                            </td>
                                            <td width="12%">
                                                <v-text-field
                                                    color="primary"
                                                    label="First Name"
                                                    variant="outlined"
                                                    density="compact"
                                                    :hide-details="true"
                                                    :disabled="loading"
                                                    v-model="poc.first_name"
                                                ></v-text-field>
                                            </td>
                                            <td width="12%">
                                                <v-text-field
                                                    color="primary"
                                                    label="Last Name"
                                                    variant="outlined"
                                                    density="compact"
                                                    :hide-details="true"
                                                    :disabled="loading"
                                                    v-model="poc.last_name"
                                                ></v-text-field>
                                            </td>
                                            <td width="30%">
                                                <v-text-field
                                                    color="primary"
                                                    label="Email"
                                                    variant="outlined"
                                                    density="compact"
                                                    :hide-details="true"
                                                    :disabled="loading"
                                                    v-model="poc.email"
                                                ></v-text-field>
                                            </td>
                                            <td width="30%">
                                                <v-select
                                                    :items="positions"
                                                    item-value="id"
                                                    item-title="title"
                                                    color="primary"
                                                    label="Position"
                                                    v-model="poc.title.id"
                                                    variant="outlined"
                                                    density="compact"
                                                    :disabled="loading"
                                                    :hide-details="true"
                                                ></v-select>
                                            </td>
                                            <td width="9%" class="text-right">
                                                <v-btn
                                                    color="grey"
                                                    icon="mdi-close"
                                                    size="x-small"
                                                    variant="plain"
                                                    :disabled="loading"
                                                    @click.prevent="toggleEdit()"
                                                ></v-btn>
                                                <v-btn
                                                    color="success"
                                                    icon="mdi-check"
                                                    size="x-small"
                                                    variant="plain"
                                                    :disabled="loading"
                                                    @click.prevent="savePoc(idx, poc)"
                                                ></v-btn>
                                            </td>
                                        </tr>
                                        <tr v-else>
                                            <td width="7%">{{ poc.prefix }}</td>
                                            <td width="12%">{{ poc.first_name }}</td>
                                            <td width="12%">{{ poc.last_name }}</td>
                                            <td width="30%">{{ poc.email }}</td>
                                            <td width="30%">{{ poc.title?.title }}</td>
                                            <td width="9%" class="text-right">
                                                <v-btn
                                                    color="grey"
                                                    icon="mdi-pencil"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="edit.push(poc.id)"
                                                ></v-btn>
                                                <v-btn
                                                    color="error"
                                                    icon="mdi-delete"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="deletePoc(idx, poc)"
                                                ></v-btn>
                                            </td>
                                        </tr>
                                    </template>
                                </tbody>
                            </table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>

        <v-btn
            color="primary"
            icon="mdi-plus"
            size="default"
            elevation="10"
            class="fab-primary"
            @click.prevent="openModal()"
        ></v-btn>
    </div>
    <v-dialog
        v-model="showModal"
        scrollable
        width="auto"
    >
        <v-card class="pa-8 my-5" elevation="2" width="800px">
            <v-row class="justify-start">
                 <v-col cols="12">
                    <h5 class="text-h5">Create New Point of Contact</h5>
                </v-col>
            </v-row>
            <v-row class="justify-start py-10">
                <v-col cols="2">
                    <v-text-field
                        color="primary"
                        label="Prefix"
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                        v-model="newPoc.prefix"
                    ></v-text-field>
                </v-col>
                <v-col cols="5">
                    <v-text-field
                        color="primary"
                        label="First Name"
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                        v-model="newPoc.first_name"
                    ></v-text-field>
                </v-col>
                <v-col cols="5">
                    <v-text-field
                        color="primary"
                        label="Last Name"
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                        v-model="newPoc.last_name"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        color="primary"
                        label="Email"
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                        v-model="newPoc.email"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-select
                        :items="positions"
                        item-value="id"
                        item-title="title"
                        color="primary"
                        label="Position"
                        v-model="newPoc.title_id"
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                    ></v-select>
                </v-col>
            </v-row>
             <v-row class="text-right">
                <v-col cols="12">
                    <v-btn
                        prepend-icon="mdi-close"
                        label="Save"
                        size="default"
                        variant="flat"
                        @click.prevent="closeModal()"
                    >
                        Cancel
                    </v-btn>
                    <v-btn
                        color="success"
                        prepend-icon="mdi-check"
                        label="Save"
                        size="default"
                        variant="flat"
                        @click.prevent="createPoc(newPoc)"
                    >
                        Create
                    </v-btn>
                </v-col>
             </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { PointOfContactService, PositionService } from '@/api/ContractService'
import type { PointOfContact, Position } from '@/types/ContractData.type'
import { defineComponent, ref } from 'vue'


export default defineComponent({
    props: {
        nav: {
            type: Object,
            required: true,
        }
    },

    setup() {
        const edit = ref([])
        const loading = ref(false)
        const showModal = ref(false)
        const newPoc = ref({
            first_name: '',
            last_name: '',
            email: '',
            prefix: '',
            title_id: null,
        })

        function toggleEdit(type: string, value: number) {
            edit.value.splice(edit.value.findIndex((p) => { return p === value }))
        }

        function openModal() {
            showModal.value = true
        }
        function closeModal() {
            showModal.value = false
            newPoc.value = {
                first_name: '',
                last_name: '',
                email: '',
                prefix: '',
                title_id: null,
            }
        }

        const positions = ref([] as Position[])
        PositionService.list()
            .then((res) => {
                positions.value = res.data
            })
            .catch((err) => {
                console.warn('Error Fetching Positions', err)
            })

        const pocs = ref([] as PointOfContact[])
        PointOfContactService.list()
            .then((res) => {
                pocs.value = res.data
            })
            .catch((err) => {
                console.warn('Error Fetching Team Members', err)
            })
            .finally(() => {
                loading.value = false
            })

        
        function createPoc(poc: PointOfContact) {
            loading.value = false

            PointOfContactService.create(poc)
                .then((res) => {
                    pocs.value.push(res.data)
                })
                .catch((err) => {
                    console.warn('Error Creating Point of Contact', err)
                })
                .finally(() => {
                    loading.value = true
                    closeModal()
                })
        }

        function savePoc(idx: number, poc: PointOfContact) {
            loading.value = true
            const formatPoc = {
                id: poc.id,
                first_name: poc.first_name,
                last_name: poc.last_name,
                email: poc.email,
                prefix: poc.prefix,
                title_id: poc.title?.id,
            }
            const editIndex = edit.value.findIndex((p) => p === poc.id)

            PointOfContactService.update(poc.id, formatPoc)
                .then((res) => {
                    pocs.value[idx] = res.data
                    edit.value.splice(editIndex, 1)
                })
                .catch((err) => {
                    console.warn('Error Updating Point of Contact', err)
                })
                .finally(() => {
                    loading.value = false
                })
        }
        
        function deletePoc(idx: number, poc: PointOfContact) {
            loading.value = true
            const editIndex = edit.value.findIndex((p) => p === poc.id)

            PointOfContactService.delete(poc.id)
                .then((res) => {
                    pocs.value.splice(idx, 1)
                    edit.value.splice(editIndex, 1)
                })
                .catch((err) => {
                    console.warn('Error Deleting Point of Contact', err)
                })
                .finally(() => {
                    loading.value = false
                })
        }

        return {
            edit, toggleEdit, loading, newPoc, pocs, positions,
            createPoc, savePoc, deletePoc,
            showModal, openModal, closeModal,
        }
    }
})
</script>

<style lang="scss" scoped>
//
</style>
