<template>
    <v-app>
        <v-text-field readonly label="counter"></v-text-field>
        <v-btn @click="increaseCounter">main - increase</v-btn>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            counter: 2
        }
    },
    methods: {
        increaseCounter() {
            this.counter++
        },
    }
}
</script>

<style>

</style>