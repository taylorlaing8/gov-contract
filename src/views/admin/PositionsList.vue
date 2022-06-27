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
                                        <th class="text-left">Title</th>
                                        <th class="text-left">Department</th>
                                        <th class="text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template
                                        v-for="(position, idx) in positions"
                                        :key="position.id"
                                    >
                                        <tr v-if="edit.includes(position.id)" >
                                            <td>
                                                <v-text-field
                                                    color="primary"
                                                    label="Title"
                                                    variant="outlined"
                                                    density="compact"
                                                    :hide-details="true"
                                                    :disabled="loading"
                                                    v-model="position.title"
                                                ></v-text-field>
                                            </td>
                                            <td>
                                                <v-text-field
                                                    color="primary"
                                                    label="Department"
                                                    variant="outlined"
                                                    density="compact"
                                                    :hide-details="true"
                                                    :disabled="loading"
                                                    v-model="position.department"
                                                ></v-text-field>
                                            </td>
                                            <td class="text-right">
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
                                                    @click.prevent="savePosition(idx, position)"
                                                ></v-btn>
                                            </td>
                                        </tr>
                                        <tr v-else>
                                            <td>{{ position.title }}</td>
                                            <td>{{ position.department }}</td>
                                            <td class="text-right">
                                                <v-btn
                                                    color="grey"
                                                    icon="mdi-pencil"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="edit.push(position.id)"
                                                ></v-btn>
                                                <v-btn
                                                    color="error"
                                                    icon="mdi-delete"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="deletePosition(idx, position)"
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
                    <h5 class="text-h5">Create New Position</h5>
                </v-col>
            </v-row>
            <v-row class="justify-start py-10">
                <v-col cols="6">
                    <v-text-field
                        color="primary"
                        label="Title"
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                        v-model="newPosition.title"
                    ></v-text-field>
                </v-col>
                <v-col cols="6">
                    <v-text-field
                        color="primary"
                        label="Department"
                        variant="outlined"
                        density="compact"
                        :hide-details="true"
                        v-model="newPosition.department"
                    ></v-text-field>
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
                        @click.prevent="createPosition(newPosition)"
                    >
                        Create
                    </v-btn>
                </v-col>
             </v-row>
        </v-card>
    </v-dialog>
</template>

<script lang="ts">
import { PositionService } from '@/api/ContractService'
import type { Position } from '@/types/ContractData.type'
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
        const newPosition = ref({
            title: '',
            department: '',
        })

        function toggleEdit(type: string, value: number) {
            edit.value.splice(edit.value.findIndex((p) => { return p === value }))
        }

        function openModal() {
            showModal.value = true
        }
        function closeModal() {
            showModal.value = false
            newPosition.value = {
                title: '',
                department: '',
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

        function createPosition(pos: Position) {
            loading.value = true

            PositionService.create(pos)
                .then((res) => {
                    positions.value.push(res.data)
                })
                .catch((err) => {
                    console.warn('Error Creating Position', err)
                })
                .finally(() => {
                    loading.value = false
                    closeModal()
                })
        }

        function savePosition(idx: number, pos: Position) {
            loading.value = true
            const editIndex = edit.value.findIndex((p) => p === pos.id)

            PositionService.update(pos.id, pos)
                .then((res) => {
                    positions.value[idx] = res.data
                    edit.value.splice(editIndex, 1)
                })
                .catch((err) => {
                    console.warn('Error Updating Position', err)
                })
                .finally(() => {
                    loading.value = false
                })
        }

        function deletePosition(idx: number, pos: Position) {
            loading.value = true
            const editIndex = edit.value.findIndex((p) => p === pos.id)

            PositionService.delete(pos.id)
                .then((res) => {
                    positions.value.splice(idx, 1)
                    edit.value.splice(editIndex, 1)
                })
                .catch((err) => {
                    console.warn('Error Deleting Position', err)
                })
                .finally(() => {
                    loading.value = false
                })
        }

        
        return {
            edit, toggleEdit, loading, newPosition, positions,
            createPosition, savePosition, deletePosition,
            showModal, openModal, closeModal,
        }
    }
})
</script>

<style lang="scss" scoped>
//
</style>
