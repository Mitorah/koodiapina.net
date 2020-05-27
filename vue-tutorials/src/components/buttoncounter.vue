<template>
    <button @click="addclick">{{"Number of clicks:" + clicks}}</button>
</template>

<script>
export default {
    data() {
        return {
          clicks: 0  
        }
    },
    methods: {
        addclick() {
            this.clicks++;
        }
    }

}
</script>

<style>

</style>