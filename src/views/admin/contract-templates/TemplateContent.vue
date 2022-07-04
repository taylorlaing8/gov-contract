<template>
    <div class="contract-content-wrapper">
        <v-row class="justify-center" :no-gutters="true">
            <v-col cols="11">
                <v-card class="px-8 py-5 my-5" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <template v-if="!edit">
                                <h5 class="text-h5">{{ template.title }}</h5>
                                <span class="text-caption">{{ template.subtitle || '-' }}</span>
                            </template>
                            <template v-else>
                                <v-text-field
                                    color="primary"
                                    label="Title"
                                    variant="outlined"
                                    density="compact"
                                    bg-color="white"
                                    :hide-details="true"
                                    v-model="template.title"
                                ></v-text-field>
                                <br />
                                <v-text-field
                                    color="primary"
                                    label="Subtitle"
                                    variant="outlined"
                                    density="compact"
                                    bg-color="white"
                                    :hide-details="true"
                                    v-model="template.subtitle"
                                ></v-text-field>
                            </template>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <v-row class="justify-center" :no-gutters="true" v-if="!loading">
            <v-col cols="11">
                <v-card class="px-8 py-5 my-5" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <table class="template-table">
                                <thead>
                                    <tr>
                                        <th class="text-left" width="63%" colspan="2">Title / Subtitle</th>
                                        <th class="text-center" width="7%">Gate</th>
                                        <th class="text-center" width="7%">Sub Gate</th>
                                        <th class="text-center" width="7%">Palt Planned</th>
                                        <th class="text-center" width="7%">Business Days</th>
                                        <!-- <th class="text-center" width="9%"></th> -->
                                    </tr>
                                </thead>
                                <tbody>
                                    <template
                                        v-for="task in template.data.tasks"
                                        :key="task.slug"
                                    >
                                        <tr v-if="task.tasks">
                                            <template v-if="edit">
                                                <td class="text-left" width="33%">
                                                    <v-text-field
                                                        color="primary"
                                                        label="Title"
                                                        variant="outlined"
                                                        density="compact"
                                                            bg-color="white"
                                                        :hide-details="true"
                                                        v-model="task.title"
                                                    ></v-text-field>
                                                </td>
                                                <td class="text-left" width="30%">
                                                    <v-text-field
                                                        color="primary"
                                                        label="Subtitle"
                                                        variant="outlined"
                                                        density="compact"
                                                            bg-color="white"
                                                        :hide-details="true"
                                                        v-model="task.sub_title"
                                                    ></v-text-field>
                                                </td>
                                                <td colspan="4"></td>
                                                <!-- <td class="text-right">
                                                    <v-btn
                                                        color="grey"
                                                        icon="mdi-close"
                                                        size="x-small"
                                                        variant="plain"
                                                        @click.prevent="toggleEdit(idx)"
                                                    ></v-btn>
                                                    <v-btn
                                                        color="success"
                                                        icon="mdi-check"
                                                        size="x-small"
                                                        variant="plain"
                                                        @click.prevent="savePoc(idx, task)"
                                                    ></v-btn>
                                                </td> -->
                                            </template>
                                            <template v-else>
                                                <td class="text-left" colspan="2">
                                                    <span class="text-body-1 parent-task">{{ task.title }}</span>
                                                    <br/>
                                                    <span class="text-caption">{{ task.sub_title }}</span>
                                                </td>
                                                <td colspan="4"></td>
                                                <!-- <td></td> -->
                                            </template>
                                        </tr>
                                        <tr v-else>
                                            <template v-if="edit">
                                                <td class="text-left" width="33%">
                                                    <v-text-field
                                                        color="primary"
                                                        label="Title"
                                                        variant="outlined"
                                                        density="compact"
                                                            bg-color="white"
                                                        :hide-details="true"
                                                        v-model="task.title"
                                                    ></v-text-field>
                                                </td>
                                                <td class="text-left" width="30%">
                                                    <v-text-field
                                                        color="primary"
                                                        label="Subtitle"
                                                        variant="outlined"
                                                        density="compact"
                                                            bg-color="white"
                                                        :hide-details="true"
                                                        v-model="task.sub_title"
                                                    ></v-text-field>
                                                </td>
                                                <td class="text-center">
                                                    <v-text-field
                                                        color="primary"
                                                        label="Gate"
                                                        variant="outlined"
                                                        density="compact"
                                                            bg-color="white"
                                                        :hide-details="true"
                                                        v-model="task.gate"
                                                    ></v-text-field>
                                                </td>
                                                <td class="text-center">
                                                    <v-text-field
                                                        color="primary"
                                                        label="Sub Gate"
                                                        variant="outlined"
                                                        density="compact"
                                                            bg-color="white"
                                                        :hide-details="true"
                                                        v-model="task.sub_gate"
                                                    ></v-text-field>
                                                </td>
                                                <td class="text-center">
                                                    <v-text-field
                                                        color="primary"
                                                        label="Palt Plan."
                                                        variant="outlined"
                                                        density="compact"
                                                            bg-color="white"
                                                        :hide-details="true"
                                                        v-model="task.palt_plan"
                                                    ></v-text-field>
                                                </td>
                                                <td class="text-center">
                                                    <v-text-field
                                                        color="primary"
                                                        label="Bus. Days"
                                                        variant="outlined"
                                                        density="compact"
                                                            bg-color="white"
                                                        :hide-details="true"
                                                        v-model="task.bus_days"
                                                    ></v-text-field>
                                                </td>
                                               <!-- <td class="text-right">
                                                    <v-btn
                                                        color="grey"
                                                        icon="mdi-close"
                                                        size="x-small"
                                                        variant="plain"
                                                        @click.prevent="toggleEdit(idx)"
                                                    ></v-btn>
                                                    <v-btn
                                                        color="success"
                                                        icon="mdi-check"
                                                        size="x-small"
                                                        variant="plain"
                                                        @click.prevent="saveTask(idx, task)"
                                                    ></v-btn>
                                                </td> -->
                                            </template>
                                            <template v-else>
                                                <td class="text-left" colspan="2">
                                                    <span class="text-body-1">{{ task.title }}</span>
                                                    <br/>
                                                    <span class="text-caption">{{ task.sub_title }}</span>
                                                </td>
                                                <td class="text-center">{{ task.gate }}</td>
                                                <td class="text-center">{{ task.sub_gate }}</td>
                                                <td class="text-center">{{ task.palt_plan}}</td>
                                                <td class="text-center">{{ task.bus_days }}</td>
                                                <!-- <td></td> -->
                                            </template>
                                        </tr>
                                        <template v-if="task.tasks">
                                            <tr v-for="subtask in task.tasks" :key="subtask.slug" class="subtask">
                                                <template v-if="edit">
                                                    <td class="text-left" width="33%">
                                                        <v-text-field
                                                            color="primary"
                                                            label="Title"
                                                            variant="outlined"
                                                            density="compact"
                                                            bg-color="white"
                                                            :hide-details="true"
                                                            v-model="subtask.title"
                                                        ></v-text-field>
                                                    </td>
                                                    <td class="text-left" width="30%">
                                                        <v-text-field
                                                            color="primary"
                                                            label="Subtitle"
                                                            variant="outlined"
                                                            density="compact"
                                                            bg-color="white"
                                                            :hide-details="true"
                                                            v-model="subtask.sub_title"
                                                        ></v-text-field>
                                                    </td>
                                                    <td class="text-center">
                                                        <v-text-field
                                                            color="primary"
                                                            label="Gate"
                                                            variant="outlined"
                                                            density="compact"
                                                            bg-color="white"
                                                            :hide-details="true"
                                                            v-model="subtask.gate"
                                                        ></v-text-field>
                                                    </td>
                                                    <td class="text-center">
                                                        <v-text-field
                                                            color="primary"
                                                            label="Sub Gate"
                                                            variant="outlined"
                                                            density="compact"
                                                            bg-color="white"
                                                            :hide-details="true"
                                                            v-model="subtask.sub_gate"
                                                        ></v-text-field>
                                                    </td>
                                                    <td class="text-center">
                                                        <v-text-field
                                                            color="primary"
                                                            label="Palt Plan."
                                                            variant="outlined"
                                                            density="compact"
                                                            bg-color="white"
                                                            :hide-details="true"
                                                            v-model="subtask.palt_plan"
                                                        ></v-text-field>
                                                    </td>
                                                    <td class="text-center">
                                                        <v-text-field
                                                            color="primary"
                                                            label="Bus. Days"
                                                            variant="outlined"
                                                            density="compact"
                                                            bg-color="white"
                                                            :hide-details="true"
                                                            v-model="subtask.bus_days"
                                                        ></v-text-field>
                                                    </td>
                                                <!-- <td class="text-right">
                                                        <v-btn
                                                            color="grey"
                                                            icon="mdi-close"
                                                            size="x-small"
                                                            variant="plain"
                                                            @click.prevent="toggleEdit(`${idx}-${sIdx}`)"
                                                        ></v-btn>
                                                        <v-btn
                                                            color="success"
                                                            icon="mdi-check"
                                                            size="x-small"
                                                            variant="plain"
                                                            @click.prevent="saveTask(sIdx, subtask)"
                                                        ></v-btn>
                                                    </td> -->
                                                </template>
                                                <template v-else>
                                                    <td class="text-left" id="subtask-title" colspan="2">
                                                        <span class="text-body-1">{{ subtask.title }}</span>
                                                        <br/>
                                                        <span class="text-caption">{{ subtask.sub_title }}</span>
                                                    </td>
                                                    <td class="text-center">{{ subtask.gate }}</td>
                                                    <td class="text-center">{{ subtask.sub_gate }}</td>
                                                    <td class="text-center">{{ subtask.palt_plan}}</td>
                                                    <td class="text-center">{{ subtask.bus_days }}</td>
                                                    <!-- <td></td> -->
                                                </template>
                                            </tr>
                                        </template>
                                    </template>
                                </tbody>
                            </table>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
        <template v-if="edit">
            <v-btn
                color="success"
                icon="mdi-check"
                size="default"
                class="fab-primary"
                @click.prevent="save()"
            ></v-btn>
            <v-btn
                color="error"
                icon="mdi-close"
                size="small"
                class="fab-secondary"
                @click.prevent="cancel()"
            ></v-btn>
        </template>
        <template v-else>
            <v-btn
                color="primary"
                icon="mdi-pencil"
                size="default"
                class="fab-primary"
                @click.prevent="edit = true"
            ></v-btn>
        </template>
    </div>
</template>

<script lang="ts">
import { TemplateService } from '@/api/ContractService'
import type { TaskBuild, Template } from '@/types/ContractData.type'
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'TemplateContent',

    props: {
        template_id: {
            type: Number,
            required: true,
        },
    },

    emits: ['loading-change'],

    setup(props, { emit }) {
        const edit = ref(false)
        const loading = ref(true)

        const template = ref({} as Template)
        function fetchTemplate() {
            loading.value = true
            emit('loading-change', true)
            TemplateService.get(props.template_id)
                .then((res) => {
                    template.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Fetching Template', err)
                })
                .finally(() => {
                    loading.value = false
                    emit('loading-change', false)
                })
        }
        fetchTemplate()

        function save() {
            loading.value = true
            emit('loading-change', true)
            TemplateService.update(props.template_id, template.value)
                .then((res) => {
                    template.value = res.data
                })
                .catch((err) => {
                    console.warn('Error Saving Template', err)
                })
                .finally(() => {
                    loading.value = false
                    emit('loading-change', false)
                    edit.value = false
                })
        }

        function cancel() {
            fetchTemplate()
            edit.value = false
        }

        return {
            edit, loading, save, cancel,
            template,
        }
    }
})

</script>

<style lang="scss" scoped>
.template-table {
    & .parent-task {
        font-weight: 500;
    }
    
    & .subtask {
        border-left: 2px solid rgba(var(--v-theme-primary), 0.75);
        background-color: rgb(var(--v-theme-light-grey));        

        & #subtask-title {
            padding-left: 32px !important;
        }
    }
}

.task-card {
    background-color: rgba(var(--v-theme-primary), 0.85);
    color: white
}
.subtask-card {
    background-color: white;
    color: rgb(var(--v-theme-primary));
}
</style>