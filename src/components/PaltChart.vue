<template>
        <Chart type="bar" :data="data" :options="vOptions" :height="300" ref="paltChart"/>
<!-- 
    <div class="card">
        <h5>Horizontal</h5>
        <Chart type="bar" :data="data" :options="hOptions" />
    </div> -->
</template>

<script lang="ts">
import { defineComponent, ref, watch } from 'vue'
import Chart from 'primevue/chart'

export default defineComponent({
    name: 'PaltChart',

    components: {
        Chart,
    },

    props: {
        task_id: {
            type: Number,
            required: true,
        },
        palt_plan: {
            type: Number,
            required: true,
        },
        palt_actual: {
            type: Number,
            required: true,
        }
    },

    setup(props) {
        function getColor() {
            if (props.palt_plan < props.palt_actual) return '204, 0, 0'
            else if (props.palt_plan > props.palt_actual) return '76, 175, 80'
            else return '33, 150, 243'
        }

        const paltChart = ref()

        watch(() => props.task_id, () => {
            setChartData()
        })

        function setChartData() {
            const chart = paltChart.value.chart
            chart.data.datasets[0] = {
                data: {
                    'Palt Planned': props.palt_plan,
                    'Palt Actual': props.palt_actual
                },
                backgroundColor: [
                    'rgba(28, 35, 71, 0.2)',
                    `rgba(${getColor()}, 0.2)`,
                ],
                borderColor: [
                    'rgba(28, 35, 71, 1)',
                    `rgba(${getColor()}, 1)`,
                ],
                borderWidth: 2
            }
            chart.update()
        }

        const data = ref({
            datasets: [{
                data: {
                    'Palt Planned': props.palt_plan,
                    'Palt Actual': props.palt_actual
                },
                backgroundColor: [
                    'rgba(28, 35, 71, 0.2)',
                    `rgba(${getColor()}, 0.2)`,
                ],
                borderColor: [
                    'rgba(28, 35, 71, 1)',
                    `rgba(${getColor()}, 1)`,
                ],
                borderWidth: 2
            }]
        })

        const vOptions = ref(
            {
                tooltips: {
                    enabled: true
                },
                // responsive: true,
                plugins: {
                    legend: {
                        display: false
                    },
                    datalabels: {
                        align: 'end',
                        anchor: 'end',
                        borderRadius: 4,
                        color: 'white',
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: {
                            display: false,
                        },
                    },
                    x: {
                        grid: {
                            display: false,
                        },
                    },
                }
            }
        )

        return {
            data,
            vOptions,
            paltChart,
        }
    }
})
</script>

<style lang="scss" scoped>

</style>