<template>
    <div class="d-flex" :class="centered ? 'justify-center' : 'justify-end'">
        <h1>{{}}</h1>
        <v-icon :size="size ? size : 'default'" :color="icon.color">{{icon.mdi}}</v-icon>
        <h4 class="pl-2" v-if="showTitle">{{icon.title}}</h4>
    </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, PropType, watch } from 'vue'
import { StatusType } from '@/types/ContractData.type'

interface IconMeta {
    title: String,
    mdi: String,
    color: String,
}

export default defineComponent({
    name: 'StatusIcon',

    props: {
        status: {
            type: String as PropType<StatusType>,
            required: true,
        },
        showTitle: {
            type: Boolean,
            required: false,
        },
        centered: {
            type: Boolean,
            required: false,
        },
        size: {
            type: String,
            required: false,
        }
    },

    setup(props) {
        const icon: Ref<IconMeta> = ref({
            title: '',
            mdi: '',
            color: '',
        })

        function updateIcon(status: StatusType) {
            switch(status) {
                case StatusType.INCOMPLETE:
                    icon.value.title = 'Incomplete',
                    icon.value.mdi = 'mdi-minus-circle',
                    icon.value.color = 'red'
                    break
                case StatusType.INPROGRESS:
                    icon.value.title = 'In-Progress',
                    icon.value.mdi = 'mdi-cached',
                    icon.value.color = 'blue'
                    break
                case StatusType.COMPLETE:
                    icon.value.title = 'Complete',
                    icon.value.mdi = 'mdi-check-circle',
                    icon.value.color = 'green'
                    break
            }
        }

        updateIcon(props.status)
        watch(() => props.status, (nStatus) => updateIcon(nStatus));
        
        return {
            icon,
        }
    },
})
</script>

<style scoped></style>
