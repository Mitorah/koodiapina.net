<template>
  <v-app>
    <v-col sm="2">
    <v-text-field v-model="inputValue"></v-text-field>
    <v-text-field readonly label="Capitalised" v-model="capitalizedMessage"></v-text-field>
    <v-text-field readonly label="Lower cased" v-model="lowercasedMessage"></v-text-field>
    </v-col>
  </v-app>
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
    },
    lowercasedMessage: function() {
      return this.inputValue.toLowerCase();
    }
  }
}
</script>