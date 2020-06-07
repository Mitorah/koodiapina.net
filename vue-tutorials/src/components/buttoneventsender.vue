<template>
  <div>
      <button @click="$emit('negative-button-event')">
        ---
        </button>
      <button @click="$emit('modifycounter', -2.0)">
        -- with parameter
      </button><br/>
      <button @click="$emit('positive-button-event')">
        ++
        </button>
      <button @click="$emit('modifycounter', 2.0)">
        ++ with parameter
      </button><br/>
      
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