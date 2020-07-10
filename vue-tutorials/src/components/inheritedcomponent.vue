<template>
    <v-app>
        <v-col cols="1">
            {{ counter }}
            <v-btn @click="increaseCounter">Main component -counter</v-btn>
            <v-btn @click="decreaseCounter">Inherited component -counter</v-btn>
        </v-col>
    </v-app>
</template>

<script>
import mixinMainComponent from './maincomponent.vue'

export default {
    mixins: [mixinMainComponent],
    data() {
        return {

        }
    },
    methods: {
        decreaseCounter() {
            this.counter--;
        }
    }
}
</script>

<style>

</style>