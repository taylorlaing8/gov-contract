<template>
    <!-- <div class="d-flex" :class="centered ? 'justify-center' : 'justify-end'">
        <i :class="`pi ${currStatus.icon} icon-${currStatus.color}`"></i>
        <h4 class="pl-2" v-if="showTitle">{{currStatus.title}}</h4>
    </div> -->
    <div class="status-wrapper flex">
        <div :class="currStatus.color" class="py-1 px-2 border-round-sm flex">
            <i :class="`pi ${currStatus.icon}`"></i>
            <span v-if="showTitle" class="ml-2">{{ currStatus.title }}</span>
        </div>
    </div>
</template>

<script lang="ts">
import { defineComponent, Ref, ref, PropType, watch } from 'vue'
import { StatusType } from '@/types/ContractData.type'

interface IconMeta {
    title: String,
    icon: String,
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
        const currStatus: Ref<IconMeta> = ref({
            title: '',
            icon: '',
            color: '',
        })

        function updateIcon(status: StatusType) {
            switch(status) {
                case StatusType.INCOMPLETE:
                    currStatus.value.title = 'Incomplete',
                    currStatus.value.icon = 'pi-times-circle',
                    currStatus.value.color = 'status-warning'
                    break
                case StatusType.INPROGRESS:
                    currStatus.value.title = 'In-Progress',
                    currStatus.value.icon = 'pi-sync',
                    currStatus.value.color = 'status-primary-color'
                    break
                case StatusType.COMPLETE:
                    currStatus.value.title = 'Complete',
                    currStatus.value.icon = 'pi-check-circle',
                    currStatus.value.color = 'status-success'
                    break
            }
        }

        updateIcon(props.status)
        watch(() => props.status, (nStatus) => updateIcon(nStatus));
        
        return {
            currStatus,
        }
    },
})
</script>

<style lang="scss" scoped>
.status-wrapper {
    & .status-warning {
        color: $error;
        background: $error-lighten-2;
    }
    & .status-primary-color {
        color: $info;
        background: $info-lighten-2;
    }
    & .status-success {
        color: $success;
        background: $success-lighten-2;
    }
}
</style>
