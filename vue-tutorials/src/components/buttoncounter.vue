<template>
    <v-app>
        <v-col>
            <v-btn @click="addclick">{{"Number of clicks:" + clicks}}</v-btn>
        </v-col>
    </v-app>
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