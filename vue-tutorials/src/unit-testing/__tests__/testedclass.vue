<template>
    <div>{{message}}</div>
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