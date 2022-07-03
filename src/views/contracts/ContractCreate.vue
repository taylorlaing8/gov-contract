<template>
    <div class="contract-content-wrapper">
        <v-row class="justify-center" :no-gutters="true">
            <v-col cols="11">
                <v-card class="px-8 py-5 my-5" elevation="2">
                    <v-row class="justify-space-between">
                        <v-col cols="12">
                            <h5 class="text-h5">Create New Contract</h5>
                        </v-col>
                    </v-row>
                </v-card>
            </v-col>
        </v-row>
    </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    setup() {
        return {
            "title": "Overhead Production Services",
            "sub_title": null,
            "slug": "overhead-production-services",
            "ucid": "FA822422R0006",
            "type": "Source Selection",
            "cycle_code": "3",
            // "status": "IC", defaulted to IC
            "value": 485.0,
            "need_date": "2022-06-14",
            "award_date": "2022-02-07",
            "start_date": "2020-11-17",
            "pop_date": "2022-11-17",


            "pocs": [
                1,
                3
            ],

            "ss_leads": [
                1
            ],
            "pco": 3,
            "buyer": 3,
            "admin_pco": 3,
            "admin_buyer": 1,

            "g_o_p": 60,
            "g_t_p": 15,
            "g_tr_p": 577,
            "g_fr_o_p": 90,
            "g_fr_t_p": 30,
            "g_fr_tr_p": 120,
            "g_fr_fr_p": 150,
            "g_fr_fv_p": 10,
        }
    }
})

</script>

<style lang="scss" scoped>
//
</style>