<template>
    <div class="contract-content-wrapper">
        <v-row :no-gutters="true" justify="center">
            <v-col cols="6">
                <v-card class="pa-8 my-5" elevation="2" width="auto">
                    <v-row class="justify-start">
                        <v-col cols="12">
                            <h5 class="text-h5">Login</h5>
                        </v-col>
                    </v-row>
                    <v-row class="justify-start py-10">
                        <v-col cols="12">
                            <v-text-field
                                prepend-icon="mdi-account"
                                color="primary"
                                label="Username"
                                variant="outlined"
                                v-model="userData.username"
                            ></v-text-field>
                            <v-text-field
                                prepend-icon="mdi-lock"
                                color="primary"
                                label="Password"
                                variant="outlined"
                                type="password"
                                v-model="userData.password"
                            ></v-text-field>
                        </v-col>
                    </v-row>
                     <v-row class="text-right">
                        <v-col cols="12">
                            <span v-if="error" style="color: red">ERROR LOGGING IN</span>
                            <v-btn color="primary" :loading="true" @click.prevent="login()">Login</v-btn>
                        </v-col>
                     </v-row>
                </v-card>
            </v-col>
        </v-row>
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
