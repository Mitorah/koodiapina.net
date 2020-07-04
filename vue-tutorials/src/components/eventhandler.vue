<template>
  <v-app>
        <v-card max-width="420">
            <v-card-actions>
            <v-text-field readonly   label="Result" v-model="counter"></v-text-field>
            </v-card-actions>
                <button-event-sender
                v-on:positive-button-event="counter++"
                v-on:negative-button-event="counter--"
                v-on:modify-counter="modifycounter">
                </button-event-sender>
        </v-card>
        <sync-parent></sync-parent>
  </v-app>
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