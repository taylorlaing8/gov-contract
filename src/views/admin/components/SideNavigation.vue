<template>
    <v-navigation-drawer v-if="!subNav" theme="dark" rail permanent>
        <template v-if="avatar">
            <v-list-item :prepend-avatar="avatar"></v-list-item>
            <v-divider></v-divider>
        </template>
        <v-list nav>
            <v-list-item
                v-for="(nav, index) in navigation"
                :key="nav.id"
                :prepend-icon="nav.icon || ''"
                :value="nav.slug"
                :active="nav.slug === $route.params.navItem"
                @click="currNav = index"
            ></v-list-item>
        </v-list>
    </v-navigation-drawer>
    <v-navigation-drawer v-else permanent width="175">
        <v-list nav>
            <v-list-item
                v-for="(nav, index) in navigation"
                :key="nav.id"
                :title="nav.title"
                :value="nav.slug"
                :active="nav.slug === $route.params.navSubItem"
                @click="currNav = index"
            ></v-list-item>
        </v-list>
    </v-navigation-drawer>
</template>

<script lang="ts">
import type { PropType } from 'vue'
import { defineComponent, computed } from 'vue'
import { useRoute } from 'vue-router'
import type AdminNav from '@/types/AdminNav.type'

export default defineComponent({
    name: 'AdminNav',

    emits: ['update:modelValue'],

    props: {
        modelValue: {
            type: Number,
            required: true,
        },
        navigation: {
            type: Array as PropType<AdminNav[]>,
            required: true,
        },
        avatar: {
            type: String,
            required: false,
        },
        subNav: {
            type: Boolean,
            required: true,
        },
    },

    setup(props, ctx) {
        const route = useRoute()

        const currNav = computed({
            get: () =>
                props.navigation.findIndex((nav) => {
                    return (
                        nav.slug ===
                        (props.subNav
                            ? route.params.subNavItem
                            : route.params.navItem)
                    )
                }),
            set: (value) => {
                ctx.emit('update:modelValue', value)
            },
        })

        return { currNav }
    },
})
</script>
<style lang="scss" scoped></style>
