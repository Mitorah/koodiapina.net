<template>
    <v-btn @click="generateBuildOrders(); $emit('save-orders', buildOrders)">Generate!</v-btn>
</template>

<script>
export default {
    data() {
        return {
            buildOrders: [[]]
        }
    },
    methods: {
        generateBuildOrders() {
            
            this.buildOrders = [
                [1,2,3],
                [4,5,6],
                [7,8,9]
            ]

            console.log(this.buildOrders)
        }
    }
}
</script>

<style>

</style>