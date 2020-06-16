<template>
    <v-btn @click="addclick">{{"Number of clicks:" + clicks}}</v-btn>
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