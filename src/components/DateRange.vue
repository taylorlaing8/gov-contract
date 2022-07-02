<template>
    <template v-if="render">
        <Calendar
            :columns="displayCols"
            :rows="displayRows"
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
        const displayRows = ref(0)
        const displayCols = ref(0)
        // ACCURATE WAY TO GET COLUMNS AND ROWS
        // function getColRow() {
        //     let months = 0
            
        //     months = (props.endDate.getFullYear() - props.startDate.getFullYear()) * 12
        //     months -= props.startDate.getMonth()
        //     months += props.endDate.getMonth()
        //     months = (months <= 0 ? 0 : months) + 1

        //     displayRows.value = (months / 3) > 1 ? Math.ceil(months / 3) : 1
        //     displayCols.value = Math.ceil(months / displayRows.value)
        // }

        // SINGLE ROW, CAPPED AT 3 COLUMNS

        function getColRow() {
            let months = 0
            
            months = (props.endDate.getFullYear() - props.startDate.getFullYear()) * 12
            months -= props.startDate.getMonth()
            months += props.endDate.getMonth()
            months = (months <= 0 ? 0 : months) + 1

            displayRows.value = 1
            displayCols.value = (months > 3) ? 3 : months
        }
        getColRow()

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
            getColRow()
            nextTick(() => {
                render.value = true
            })
        })

        return {
            render,
            displayCols,
            displayRows,
            calendarAttrs,
            fromDate,
        }
    }
})

</script>

<style scoped>

</style>