<template>
  <div>
        <v-row>

        <v-col cols="2">
            <button-event-sender
            v-on:positive-button-event="counter++"
            v-on:negative-button-event="counter--"
            v-on:modify-counter="modifycounter">
            </button-event-sender>
        </v-col>
        <v-col cols="2">
        <v-text-field readonly label="Result" v-model="counter"></v-text-field>
        </v-col>
        </v-row>
        <br/>
        <br/>
        <br/>
        <sync-parent></sync-parent>
  </div>
</template>

<script>
import buttoneventsenderVue from './buttoneventsender.vue'
import syncparentVue from './syncparent.vue'

export default {
    components: {
        'button-event-sender': buttoneventsenderVue,
        'sync-parent': syncparentVue,
    },
    data() {
        return {
            counter: 0
        }
    },
    methods: {
        modifycounter(value) {
            this.counter += value
        }
    }

}
</script>

<style>

</style>