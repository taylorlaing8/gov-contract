<template>
    <v-table fixed-header height="300px">
        <thead>
            <tr>
                <th v-for="col in cols" :key="col.id" class="text-left">
                    {{ col.title }}
                </th>
            </tr>
        </thead>
        <tbody>
            <tr v-for="row in data" :key="row.id">
                <td>{{ item.customer }}</td>
                <td>{{ item.description }}</td>
                <td>{{ item.amount }}</td>
            </tr>
        </tbody>
    </v-table>
</template>

<script lang="ts">
import { defineComponent } from 'vue'

export default defineComponent({
    name: 'DataTable',

    props: {
        cols: {
            type: Array,
            required: true,
        },
        data: {
            type: Array,
            required: true,
        },
    },

    setup() {
        return {}
    },
})
</script>
<style lang="scss" scoped>
//
</style>
