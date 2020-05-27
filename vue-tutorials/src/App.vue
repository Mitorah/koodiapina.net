<template>
  <div>
    <ol>
      <li v-for='item in arrayToShow'
      :key="item.text">
      {{ '[' + item.text + "]: "}} <br/>
      {{ item.value }} <br/><br/>

      </li>
    </ol>

    <input v-model.trim="message" @change="onMessageChanged(message)">
    <br/><br/><br/>
    {{ message }}
    <br/>
    <br/>

  <button-counter></button-counter><br/>

  <br/>  
  <br/>  

  <reverse-string></reverse-string>

  <br/>  
  <br/>  

  <scramble-string></scramble-string>

  </div>
</template>

<script>
import buttoncounterVue from './components/buttoncounter.vue';
import reversestringVue from './components/reversestring.vue';
import scramblestringVue from './components/scramblestring.vue';

export default {
  name: 'App',
  components: {
    'button-counter': buttoncounterVue,
    'reverse-string': reversestringVue,
    'scramble-string': scramblestringVue
  },
  data() {
    return {
      arrayToShow: [
        { text: 'first item in list', value:'hurrdurr1' },
        { text: 'second item in list', value:'hurrdurr2'},
        { text: 'third item in list', value:'hurrdurr3' },
        { text: 'fourth item in list', value:'hurrdurr4' },
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
