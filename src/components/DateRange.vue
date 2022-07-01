<template>
    <template v-if="render">
        <Calendar
            :columns="displayColumns() / displayRows()"
            :rows="displayRows()"
            :attributes="calendarAttrs"
            :from-page="fromDate"
        ></Calendar>
    </template>
</template>

<script lang="ts">
import { defineComponent, watch, ref, nextTick } from 'vue'
import { Calendar } from 'v-calendar'

export default defineComponent({
    name: 'DateRange',

    components: {
        Calendar,
    },

    props: {
        startDate: {
            type: Date,
            required: true,
        },
        endDate: {
            type: Date,
            required: true,
        }
    },

    setup(props) {
        const render = ref(true)
        const displayColumns = () => (props.endDate.getMonth() - props.startDate.getMonth() + 1)
        const displayRows = () => displayColumns() > 1 ?  Math.floor(displayColumns() / 2) : 1

        const calendarAttrs = ref([
            {
                highlight: {
                    start: { fillMode: 'solid' },
                    base: { fillMode: 'light' },
                    end: { fillMode: 'solid' },
                },
                dates: { start: props.startDate, end: props.endDate },
            },
        ])
        const fromDate = ref({ month: props.startDate.getMonth() + 1, year: props.startDate.getFullYear() })

        watch(() => props.startDate, () => {
            render.value = false
            calendarAttrs.value = [{
                highlight: {
                    start: { fillMode: 'solid' },
                    base: { fillMode: 'light' },
                    end: { fillMode: 'solid' },
                },
                dates: { start: props.startDate, end: props.endDate },
            }]
            fromDate.value = { month: props.startDate.getMonth() + 1, year: props.startDate.getFullYear() }
            nextTick(() => {
                render.value = true
            })
        })

        return {
            render,
            displayColumns,
            displayRows,
            calendarAttrs,
            fromDate,
        }
    }
})

</script>

<style scoped>

</style>