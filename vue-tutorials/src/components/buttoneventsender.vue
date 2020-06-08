<template>
  <div>
      <button @click="$emit('negative-button-event')">
        --
      </button>
      <button @click="$emit('positive-button-event')">
        ++
        </button>
      <br/>
      <br/>
      <input type="number" v-model="modifier" placeholder="Positive or negative">
      <br/>
      <br/>
      <button @click="$emit('modify-counter', modifierAsNumber)">
      With parameter
      </button>
  </div>
</template>

<script>
export default {
    data() {
        return {
            counter: 0,
            modifier: null
        }
    },
    computed: {
      modifierAsNumber() {
        return Number(this.modifier)
      }
    }
}
</script>

<style>

</style>