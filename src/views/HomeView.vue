<template>
    <div>
        <h1 class="joes-class">Joe's First Site</h1>
        <p :class="data > otherData ? 'joes-class' : ''">paragraph</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
    name: 'HomeView',
    
    setup() {
        const staticData = ref("Hello World")

        const data = 88
        const otherData = 56

        function getGreatest(numOne, numTwo) {
            
        }

        function connectString(stringOne, stringTwo) {
            return stringOne + stringTwo
        }

        console.log(getGreatest(1, 56))
        console.log(connectString("hello", "world"))

        return { 
            staticData, data, otherData
        }
    },
})
</script>

<style lang="scss" scoped>
.joes-class {
    color: blue;
}
</style>
