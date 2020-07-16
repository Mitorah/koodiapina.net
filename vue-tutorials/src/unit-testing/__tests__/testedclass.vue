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
    },
    methods: {
        changeMessage(newName) {
            this.message = newName
        }
    }
}
</script>

<style>

</style>