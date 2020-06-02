<template>
  <div>

    <nav-bar></nav-bar>

    <br/>  
    <br/>  


    <list-component></list-component>
  
    <br/>  
    <br/>  

    <button-counter></button-counter><br/>

    <br/>  
    <br/>  

    <reverse-string></reverse-string>

    <br/>  
    <br/>  

    <scramble-string></scramble-string>

    <br/>  
    <br/>  

    <dynamic-arguments dynamicAttribute="mousedown"></dynamic-arguments>
    <dynamic-arguments dynamicAttribute="mouseover"></dynamic-arguments>
    <dynamic-arguments dynamicAttribute="mouseup"></dynamic-arguments>

    <br/>
    <br/>

    <random-number-button></random-number-button>
    <random-number-button></random-number-button>

    <br/>
    <br/>

    <capitalize-string message="this sHoulD BE capitAlizeD!"></capitalize-string>
    <capitalize-string message="tHIs ShoULd bE caPItALIzED!"></capitalize-string>

    <br/>
    <br/>

    <multiple-checkboxes :idObjects=arrayForCheckbox></multiple-checkboxes>

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
  },
  data() {
    return {
      arrayToShow: [
        { text: 'first item in list', value:'hurrdurr1' },
        { text: 'second item in list', value:'hurrdurr2'},
        { text: 'third item in list', value:'hurrdurr3' },
        { text: 'fourth item in list', value:'hurrdurr4' },
      ],
      arrayForCheckbox: [
        { id: "firstID", value:"FirstValue" },
        { id: "secondID", value:"SecondValue" },
        { id: "thirdID", value:"HurrDurr" },
        { id: "fourthID", value:"HerpDerp" },
        { id: "fifthID", value:"HirryHarry" },
      ],
      message: 'Page loaded at ' + Date().toLocaleString(),
    }
  },
  methods: {
    onMessageChanged(input) {
      this.arrayToShow.push({text: input, value: 0})
      this.message = '';
    }
  }
  
  
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
