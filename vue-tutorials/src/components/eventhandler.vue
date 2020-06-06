<template>
  <div>
        <button-event-sender
        v-on:positive-button-event="counter++"
        v-on:negative-button-event="counter--"
        v-on:modifycounter="modifycounter">
        </button-event-sender>
        {{ counter }}
  </div>
</template>

<script>
import buttoneventsenderVue from './buttoneventsender.vue'

export default {
    components: {
        'button-event-sender': buttoneventsenderVue
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