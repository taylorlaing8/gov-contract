<template>
    <div class="grid justify-content-center">
        <div class="col-5 mt-6">
            <div class="surface-card p-6 shadow-2 border-round w-full">
                <div class="text-center mb-5">
                    <img src="../../public/SVG/favicon.svg" alt="Image" height="50" class="mb-3">
                    <div class="text-900 text-3xl font-medium mb-3">Login</div>
                    <!-- <span class="text-600 font-medium line-height-3">Don't have an account?</span>
                    <a class="font-medium no-underline ml-2 text-blue-500 cursor-pointer">Create today!</a> -->
                </div>

                <div>
                    <label for="username" class="block text-900 font-medium mb-2">Username</label>
                    <InputText id="username" type="text" class="w-full mb-3" v-model="user.username"/>

                    <label for="password" class="block text-900 font-medium mb-2">Password</label>
                    <InputText id="password" type="password" class="w-full mb-3" v-model="user.password"/>

                    <!-- <div class="flex align-items-center justify-content-between mb-6">
                        <div class="flex align-items-center">
                            <Checkbox id="rememberme1" :binary="true" v-model="checked1" class="mr-2"></Checkbox>
                            <label for="rememberme1">Remember me</label>
                        </div>
                        <a class="font-medium no-underline ml-2 text-blue-500 text-right cursor-pointer">Forgot password?</a>
                    </div> -->

                    <Button label="Sign In" icon="pi pi-user" class="w-full mt-4" @click="login()"></Button>
                </div>
            </div>
        </div>
    </div>
</template>

<script lang="ts">
import router from '@/router'
import { defineComponent, ref } from 'vue'
import { useStore } from 'vuex'
import InputText from 'primevue/inputtext'
// import Checkbox from 'primevue/checkbox'
import Button from 'primevue/button'

export default defineComponent({
    name: 'LoginView',

    components: {
        InputText,
        Button,
    },

    setup() {
        const store = useStore()
        const loading = ref(true)
        const error = ref(false)

        const user = ref({
            username: '',
            password: '',
        })

        // store.commit('removeTokens')

        async function login() {
            loading.value = true
            store

                .dispatch('obtainToken', user.value)
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
            user,
            login,
        }
    },
})
</script>
<style lang="scss" scoped>
//
</style>
