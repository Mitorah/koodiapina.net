<template>
  <div>
    <span> {{ capitalizedMessage }} </span>
  </div>
</template>

<script>
export default {
  props {
    message: String
  },
  data() {
    return {
    }
  },
  computed: {
    capitalizedMessage: function() {
      return message.toUpperCase();
    }
  }
}
</script>