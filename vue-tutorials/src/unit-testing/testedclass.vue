<template>
    <v-app>{{ message }}</v-app>
</template>

<script>
export default {
    data () {
        return {
            message: "Hello"        
        }
    },
    created() {
        this.message = "Bye"
    }
}
</script>

<style>

</style>