<template>
    <v-app>
      <v-navigation-drawer absolute temporary v-model="sideNav">
        <v-btn
        v-for="item in componentTabs"
        :key="item.title"
        @click="currentTab = item.value; sideNav = false">
        {{ item.title }}
        </v-btn>
      </v-navigation-drawer>

        <v-app-bar dense >
          <v-app-bar-nav-icon @click.stop="sideNav = !sideNav"></v-app-bar-nav-icon>
          <v-toolbar-title>Tutorials</v-toolbar-title>
          <v-spacer></v-spacer>
            <v-btn icon>
            <v-icon>mdi-magnify</v-icon>
            </v-btn>
        </v-app-bar>
      
        <v-card>
        <component :is="currentTab"></component>
        </v-card>
    </v-app>

</template>

<script>
import firebasemainVue from './firebase-tutorial/components/firebasemain.vue';
import buttoncounterVue from './components/buttoncounter.vue';
import reversestringVue from './components/reversestring.vue';
import scramblestringVue from './components/scramblestring.vue';
import dynamicargumentsVue from './components/dynamicarguments.vue';
import addtolistVue from './components/listcomponent.vue';
import randomnumberbuttonVue from './components/randomnumberbutton.vue';
import modifystringcapitalisationVue from './components/modifystringcapitalisation.vue';
import multiplecheckboxesVue from './components/multiplecheckboxes.vue';
import eventhandlerVue from './components/eventhandler.vue';
import timeconverterVue from './components/timeconverter.vue';
import sortingExercisesVue from './sorting-exercises/components/sortingexercises.vue';
import mixinexampleVue from './components/mixinexample.vue';
import wayOfWaterVue from './way-of-water/way-of-water.vue';

export default {
  name: 'App',
  components: {
    'way-of-water': wayOfWaterVue,
    'firebase-main': firebasemainVue,
    'sorting-algorithms': sortingExercisesVue,
    'list-component': addtolistVue,
    'button-counter': buttoncounterVue,
    'reverse-string': reversestringVue,
    'scramble-string': scramblestringVue,
    'dynamic-arguments': dynamicargumentsVue,
    'random-number-button': randomnumberbuttonVue,
    'modify-string-capitalisation': modifystringcapitalisationVue,
    'multiple-checkboxes': multiplecheckboxesVue,
    'event-handler': eventhandlerVue,
    'time-converter': timeconverterVue,
    'inherit-components': mixinexampleVue,
    
  },
  data() {
    return {
      sideNav: false,
      currentTab: "",
      componentTabs: [
        { title: "WayOfWater", value: "way-of-water"},
        { title: "Firebase", value: "firebase-main"},
        { title: "Sorting", value: "sorting-algorithms"},
        { title: "List", value: "list-component"},
        { title: "Button", value: "button-counter"},
        { title: "Reverse", value: "reverse-string"},
        { title: "Scramble", value: "scramble-string"},
        { title: "Dynamic", value: "dynamic-arguments"},
        { title: "RNG", value: "random-number-button"},
        { title: "Capitalize", value: "modify-string-capitalisation"},
        { title: "Checkboxes", value: "multiple-checkboxes"},
        { title: "Events", value: "event-handler"},
        { title: "TimeConverter", value: "time-converter"},
        { title: "Inheriting", value: "inherit-components"},
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
  text-align: left;
  color: #2c3e50;
  margin-top: 0px;
}
</style>
