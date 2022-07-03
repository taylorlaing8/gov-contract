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
                            <table class="templates-table">
                                <thead>
                                    <tr>
                                        <th class="text-left">Title</th>
                                        <th class="text-left">Subtitle</th>
                                        <th class="text-left"></th>
                                    </tr>
                                </thead>
                                <tbody>
                                    <template
                                        v-for="(template, idx) in templates"
                                        :key="template.id"
                                    >
                                        <tr>
                                            <td>{{ template.title }}</td>
                                            <td>{{ template.subtitle }}</td>
                                            <td class="text-right">
                                                <v-btn
                                                    color="grey"
                                                    icon="mdi-pencil"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="editTemplate(template.id)"
                                                ></v-btn>
                                                <v-btn
                                                    color="error"
                                                    icon="mdi-delete"
                                                    size="x-small"
                                                    variant="plain"
                                                    @click.prevent="deleteTemplate(idx, template)"
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
            @click.prevent="createTemplate()"
        ></v-btn>
    </div>
</template>

<script lang="ts">
import { TemplateService } from '@/api/ContractService'
import type { Template } from '@/types/ContractData.type'
import { defineComponent, ref } from 'vue'

export default defineComponent({
    props: {
        nav: {
            type: Object,
            required: true,
        }
    },

    emits: ['loading-change'],
    
    setup(props , { emit }) {
        
        emit('loading-change', true)
        const templates = ref([] as Template[])
        TemplateService.list()
            .then((res) => {
                templates.value = res.data
            })
            .catch((err) => {
                console.warn('Error Fetching Templates', err)
            })
            .finally(() => {
                emit('loading-change', false)
            })

        return {
            templates
        }
    }
})
</script>

<style lang="scss" scoped>
.templates-table {
    & tbody {
        & tr {
            &:hover {
                cursor: pointer;
                background-color: #1d9fca25;
                border-radius: 3px;
            }
        }
    }
}
</style>