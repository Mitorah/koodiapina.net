<template>
  <v-app>
      <v-col>
        <dynamic-button dynamicAttribute="mousedown"></dynamic-button>
        <dynamic-button dynamicAttribute="mouseover"></dynamic-button>
        <dynamic-button dynamicAttribute="mouseup"></dynamic-button>
      </v-col>
  </v-app>
</template>

<script>
import dynamicbuttonVue from './dynamicbutton.vue'
export default {
    components: {
        'dynamic-button': dynamicbuttonVue
    }
}
</script>

<style>

</style>