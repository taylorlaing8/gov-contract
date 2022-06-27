<template>
    <template v-if="render">
        <Calendar
            :columns="displayColumns()"
            :attributes="calendarAttrs"
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

        const calendarAttrs = ref([
            {
                key: 'today',
                highlight: { fillMode: 'outline' },
                dates: new Date(),
            },
            {
                highlight: {
                    start: { fillMode: 'solid' },
                    base: { fillMode: 'light' },
                    end: { fillMode: 'solid' },
                },
                dates: { start: props.startDate, end: props.endDate },
            },
        ])

        watch(() => props.startDate, () => {
            render.value = false
            calendarAttrs.value[1] = {
                highlight: {
                    start: { fillMode: 'solid' },
                    base: { fillMode: 'light' },
                    end: { fillMode: 'solid' },
                },
                dates: { start: props.startDate, end: props.endDate },
            }
            nextTick(() => {
                render.value = true
            })
        })

        return {
            render,
            displayColumns,
            calendarAttrs,
        }
    }
})

</script>

<style scoped>

</style>