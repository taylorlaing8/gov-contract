<template>
    <v-navigation-drawer width="200" permanent>
        <v-list nav>
            <v-list-item
                v-for="navItem in nav"
                :key="navItem.id"
                :title="navItem.title"
                :prepend-icon="navItem.icon"
                :active="$route.params.nav_item === navItem.slug"
                active-color="primary"
                @click="updateActiveNav(navItem.slug)"
            ></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <div class="contract-content-wrapper">
        <v-row class="justify-center" :no-gutters="true">
            <v-col cols="11">
                <v-card class="px-8 py-5 my-5" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <h5 class="text-h5">{{ activeNav.title }}</h5>
                        </v-col>
                    </v-row>
                </v-card>
                <v-card
                    v-if="activeNav.slug === 'pocs'"
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
                                        <tr v-if="loading.pocs">
                                            <td width="100%" class="text-center">
                                                LOADING...
                                            </td>
                                        </tr>
                                        <tr v-else-if="edit.pocs.includes(poc.id)">
                                            <td width="7%">
                                                <v-text-field
                                                    color="primary"
                                                    label="Prefix"
                                                    variant="outlined"
                                                    density="compact"
                                                    :hide-details="true"
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
                                                    :hide-details="true"
                                                ></v-select>
                                            </td>
                                            <td width="9%" class="text-right">
                                                <v-btn
                                                    color="grey"
                                                    icon="mdi-close"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="toggleEdit('poc', poc.id)"
                                                ></v-btn>
                                                <v-btn
                                                    color="success"
                                                    icon="mdi-check"
                                                    size="x-small"
                                                    variant="plain"
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
                                                    @click.prevent="edit.pocs.push(poc.id)"
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
                <v-card
                    v-if="activeNav.slug === 'positions'"
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
                                        <tr v-if="loading.positions">
                                            <td width="100%" class="text-center">
                                                LOADING...
                                            </td>
                                        </tr>
                                        <tr v-else-if="edit.positions.includes(position.id)" >
                                            <td>
                                                <v-text-field
                                                    color="primary"
                                                    label="Title"
                                                    variant="outlined"
                                                    density="compact"
                                                    :hide-details="true"
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
                                                    v-model="position.department"
                                                ></v-text-field>
                                            </td>
                                            <td class="text-right">
                                                <v-btn
                                                    color="grey"
                                                    icon="mdi-close"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="toggleEdit('position', position.id)"
                                                ></v-btn>
                                                <v-btn
                                                    color="success"
                                                    icon="mdi-check"
                                                    size="x-small"
                                                    variant="plain"
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
                                                    @click.prevent="edit.positions.push(position.id)"
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
            @click.prevent="openModal(activeNav.slug)"
        ></v-btn>
    </div>
    <v-dialog
        v-model="showNewPoc"
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
                        @click.prevent="closeModal('poc')"
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
    <v-dialog
        v-model="showNewPosition"
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
                        @click.prevent="closeModal('position')"
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
import { defineComponent, ref, watch } from 'vue'
// import { useDisplay } from 'vuetify'
import router from '@/router'
import { useRoute } from 'vue-router'
import type { PointOfContact, Position } from '@/types/ContractData.type'
import { PositionService, PointOfContactService } from '@/api/ContractService'

interface navLink {
    title: string
    slug: string
    icon: string
}

export default defineComponent({
    name: 'POCDashboard',

    setup() {
        const route = useRoute()

        const nav = ref([
            {
                title: 'Team Members',
                slug: 'pocs',
                icon: 'mdi-account-group',
            },
            {
                title: 'Positions',
                slug: 'positions',
                icon: 'mdi-badge-account',
            },
        ] as navLink[])

        const activeNav = ref({} as navLink)
        watch(
            () => route.params,
            (params) => {
                if (route.name === 'pocs' && !params.nav_item) updateActiveNav()
            },
        )
        function updateActiveNav(nSlug?: string) {
            let navItem: navLink|undefined = undefined
            if (!nSlug && route.params.nav_item) navItem = nav.value.find((n) => n.slug === route.params.nav_item)
            else navItem = nav.value.find((n) => n.slug === nSlug)

            activeNav.value = navItem ? navItem : nav.value[0]
            router.push({
                name: 'pocs',
                params: {
                    nav_item: activeNav.value.slug,
                },
            })
        }
        updateActiveNav()

        const edit = ref({
            pocs: [],
            positions: [],
        })
        function toggleEdit(type: string, value: number) {
            switch (type) {
                case 'poc':
                    edit.value.pocs.splice(edit.value.pocs.findIndex((p) => { return p === value }))
                    break
                case 'position':
                    edit.value.positions.splice(edit.value.positions.findIndex((p) => { return p === value }))
                    break
            }
        }

        const loading = ref({
            pocs: true,
            positions: true,
        })

        function openModal(slug: string) {
            switch (slug) {
                case 'pocs':
                    showNewPoc.value = true
                    break
                case 'positions':
                    showNewPosition.value = true
                    break
            }
        }
        function closeModal(slug: string) {
            switch (slug) {
                case 'poc':
                    showNewPoc.value = false
                    newPoc.value = {
                        first_name: '',
                        last_name: '',
                        email: '',
                        prefix: '',
                        title_id: null,
                    }
                    break
                case 'position':
                    showNewPosition.value = false
                    newPosition.value = {
                        title: '',
                        department: '',
                    }
                    break
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
            .finally(() => {
                loading.value.positions = false
            })

        const showNewPosition = ref(false)
        const newPosition = ref({
            title: '',
            department: '',
        })
        function createPosition(pos: Position) {
            loading.value.positions = true

            PositionService.create(pos)
                .then((res) => {
                    positions.value.push(res.data)
                })
                .catch((err) => {
                    console.warn('Error Creating Position', err)
                })
                .finally(() => {
                    loading.value.positions = false
                    showNewPosition.value = false
                })
        }

        function savePosition(idx: number, pos: Position) {
            loading.value.positions = true
            const editIndex = edit.value.pocs.findIndex((p) => p === pos.id)

            PositionService.update(pos.id, pos)
                .then((res) => {
                    positions.value[idx] = res.data
                    edit.value.positions.splice(editIndex, 1)
                })
                .catch((err) => {
                    console.warn('Error Updating Position', err)
                })
                .finally(() => {
                    loading.value.positions = false
                })
        }

        function deletePosition(idx: number, pos: Position) {
            loading.value.positions = true
            const editIndex = edit.value.positions.findIndex((p) => p === pos.id)

            PositionService.delete(pos.id)
                .then((res) => {
                    positions.value.splice(idx, 1)
                    edit.value.positions.splice(editIndex, 1)
                })
                .catch((err) => {
                    console.warn('Error Deleting Position', err)
                })
                .finally(() => {
                    loading.value.positions = false
                })
        }

        const pocs = ref([] as PointOfContact[])
        PointOfContactService.list()
            .then((res) => {
                pocs.value = res.data
            })
            .catch((err) => {
                console.warn('Error Fetching Team Members', err)
            })
            .finally(() => {
                loading.value.pocs = false
            })

        const showNewPoc = ref(false)
        const newPoc = ref({
            first_name: '',
            last_name: '',
            email: '',
            prefix: '',
            title_id: null,
        })
        function createPoc(poc: PointOfContact) {
            loading.value.pocs = false

            PointOfContactService.create(poc)
                .then((res) => {
                    pocs.value.push(res.data)
                })
                .catch((err) => {
                    console.warn('Error Creating Point of Contact', err)
                })
                .finally(() => {
                    loading.value.pocs = true
                    showNewPoc.value = false
                })
        }

        function savePoc(idx: number, poc: PointOfContact) {
            loading.value.pocs = true
            const formatPoc = {
                id: poc.id,
                first_name: poc.first_name,
                last_name: poc.last_name,
                email: poc.email,
                prefix: poc.prefix,
                title_id: poc.title?.id,
            }
            const editIndex = edit.value.pocs.findIndex((p) => p === poc.id)

            PointOfContactService.update(poc.id, formatPoc)
                .then((res) => {
                    pocs.value[idx] = res.data
                    edit.value.pocs.splice(editIndex, 1)
                })
                .catch((err) => {
                    console.warn('Error Updating Point of Contact', err)
                })
                .finally(() => {
                    loading.value.pocs = false
                })
        }
        function deletePoc(idx: number, poc: PointOfContact) {
            loading.value.pocs = true
            const editIndex = edit.value.pocs.findIndex((p) => p === poc.id)

            PointOfContactService.delete(poc.id)
                .then((res) => {
                    pocs.value.splice(idx, 1)
                    edit.value.pocs.splice(editIndex, 1)
                })
                .catch((err) => {
                    console.warn('Error Deleting Point of Contact', err)
                })
                .finally(() => {
                    loading.value.pocs = false
                })
        }

        return {
            nav, activeNav, updateActiveNav,
            loading, edit, toggleEdit, openModal, closeModal,
            positions, showNewPosition, newPosition, createPosition, savePosition, deletePosition,
            pocs, showNewPoc, newPoc, createPoc, savePoc, deletePoc,
        }
    },
})
</script>
<style lang="scss" scoped>
//
</style>
