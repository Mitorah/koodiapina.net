<template>
  <div>
    <v-card>
      <v-card-actions>
          <v-btn @click="$emit('positive-button-event')">
            ++
          </v-btn>
          <v-btn @click="$emit('negative-button-event')">
            --
          </v-btn>
        </v-card-actions>
        <v-card-actions>
          <v-text-field type="number" v-model="modifier" label="Positive or negative">
          </v-text-field>
          <v-btn @click="$emit('modify-counter', modifierAsNumber)">
          Modify with parameter
          </v-btn>
      </v-card-actions>
    </v-card>
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