<template>
  <div>
      <v-row>
      <v-btn @click="$emit('negative-button-event')">
        --
      </v-btn>
      <v-btn @click="$emit('positive-button-event')">
        ++
      </v-btn>
      </v-row>
      <v-row>
          <v-col>
            <v-text-field type="number" v-model="modifier" label="Positive or negative">
            </v-text-field>
            <v-btn @click="$emit('modify-counter', modifierAsNumber)">
            With parameter
            </v-btn>
          </v-col>
      </v-row>
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