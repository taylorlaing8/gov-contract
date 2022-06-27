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
                <!-- <v-card
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
                </v-card> -->
            </v-col>
        </v-row>

        <!-- <v-btn
            color="primary"
            icon="mdi-plus"
            size="default"
            elevation="10"
            class="fab-primary"
            @click.prevent="openModal()"
        ></v-btn> -->
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'


export default defineComponent({
    props: {
        nav: {
            type: Object,
            required: true,
        }
    },
    
    setup() {
        
        return {

        }
    }
})
</script>

<style land="scss" scoped>

</style>