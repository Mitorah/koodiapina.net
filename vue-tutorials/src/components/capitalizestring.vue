<template>
  <div>
    <input type="text" v-model="inputValue"><br/>
    <span> {{ capitalizedMessage }} </span>
  </div>
</template>

<script>
export default {
  data() {
    return {
      inputValue: ""
    }
  },
  computed: {
    capitalizedMessage: function() {
      return this.inputValue.toUpperCase();
    }
  }
}
</script>