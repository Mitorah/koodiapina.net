<template>
  <div>
      <button @click="$emit('negative-button-event')">
        ---
        </button>
      <button @click="$emit('positive-button-event')">
        ++
        </button>
      <button @click="$emit('modifycounter', 5.0)">
        ++ with parameter
      </button>
      <button @click="$emit('modifycounter', -5.0)">
        -- with parameter
      </button>
      
  </div>
</template>

<script>
export default {
    data() {
        return {
            counter: 0
        }
    },
}
</script>

<style>

</style>