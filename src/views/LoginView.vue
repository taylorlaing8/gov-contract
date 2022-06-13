<template>
    <div>
        <v-card class="elevation-12">
            <v-toolbar dark color="primary">
                <v-toolbar-title>Login</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
                <v-form>
                    <v-text-field
                        prepend-icon="person"
                        name="login"
                        label="Login"
                        type="text"
                        v-model="userData.username"
                    ></v-text-field>
                    <v-text-field
                        id="password"
                        prepend-icon="lock"
                        name="password"
                        label="Password"
                        type="password"
                        v-model="userData.password"
                    ></v-text-field>
                </v-form>
            </v-card-text>
            <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn color="primary" :loading="true" @click.prevent="login()"
                    >Login</v-btn
                >
            </v-card-actions>
            <span v-if="error" style="color: red">ERROR LOGGING IN</span>
        </v-card>
    </div>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'

export default defineComponent({
    name: 'LoginView',

    setup() {
        const store = useStore()
        const loading = ref(true)
        const error = ref(false)

        const userData = ref({
            username: '',
            password: '',
        })

        // store.commit('removeTokens')

        async function login() {
            loading.value = true
            store

                .dispatch('obtainToken', userData.value)
                .then(() => {
                    setTimeout(() => {}, 10000)
                    loading.value = false
                    router.push(localStorage.getItem('route') || '/')
                })
                .catch((err) => {
                    console.warn('LOGIN ERROR', err)
                    error.value = true
                })
        }

        return {
            loading,
            error,
            userData,
            login,
        }
    },
})
</script>
<style lang="scss" scoped>
//
</style>
