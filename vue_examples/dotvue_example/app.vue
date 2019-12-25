<template>
    <div id="app">
    {{ greeting }} World!!
    </div>
</template>

<script>
export default {
    data() {
        return {
            message: 'Hello',
        }
    }
}
</script>

<style scoped>
p {
    font-size: 2em;
    text-align: center;
}
</style>