<template>
  <v-app>
      String in child: {{ message }}
      <br/>
      <input
      type="text"
      v-bind:message="message"
      @input="$emit('input', $event.target.value)"
      >
  </v-app>
</template>

<script>
export default {
    model: {
        prop: 'message',
        event: 'input'
    },
    props: {
        message: String
        },
    data() {
        return {
        }
    },
}
</script>

<style>

</style>