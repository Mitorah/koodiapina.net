<template>
  <div>

    <button
    v-for="item in componentTabs"
    :key="item.title"
    @click="currentTab = item.value">
    {{ item.title }}
    </button>

    <br/>
    <br/>

    <component :is="currentTab"></component>

  </div>
</template>

<script>
import buttoncounterVue from './components/buttoncounter.vue';
import reversestringVue from './components/reversestring.vue';
import scramblestringVue from './components/scramblestring.vue';
import dynamicargumentsVue from './components/dynamicarguments.vue';
import addtolistVue from './components/listcomponent.vue';
import randomnumberbuttonVue from './components/randomnumberbutton.vue';
import capitalizestringVue from './components/capitalizestring.vue';
import navbarVue from './components/navbar.vue';
import multiplecheckboxesVue from './components/multiplecheckboxes.vue';
import eventhandlerVue from './components/eventhandler.vue';

export default {
  name: 'App',
  components: {
    'list-component': addtolistVue,
    'button-counter': buttoncounterVue,
    'reverse-string': reversestringVue,
    'scramble-string': scramblestringVue,
    'dynamic-arguments': dynamicargumentsVue,
    'random-number-button': randomnumberbuttonVue,
    'capitalize-string': capitalizestringVue,
    'nav-bar': navbarVue,
    'multiple-checkboxes': multiplecheckboxesVue,
    'event-handler': eventhandlerVue,
  },
  data() {
    return {
      currentTab: "",
      componentTabs: [
        { title: "List", value: "list-component"},
        { title: "Button", value: "button-counter"},
        { title: "Reverse", value: "reverse-string"},
        { title: "Scramble", value: "scramble-string"},
        { title: "Dynamic", value: "dynamic-arguments"},
        { title: "RNG", value: "random-number-button"},
        { title: "Capitalize", value: "capitalize-string"},
        { title: "Nav", value: "nav-bar"},
        { title: "Checkboxes", value: "multiple-checkboxes"},
        { title: "Events", value: "event-handler"},
      ]
    }
  },
  methods: {
    onMessageChanged(input) {
      this.arrayToShow.push({text: input, value: 0})
      this.message = '';
    }
  },
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
