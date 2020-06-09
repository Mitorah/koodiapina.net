<template>
  <div>
        <button-event-sender
        v-on:positive-button-event="counter++"
        v-on:negative-button-event="counter--"
        v-on:modify-counter="modifycounter">
        </button-event-sender>
        <br/>
        {{ counter }}
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