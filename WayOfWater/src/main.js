import Vue from 'vue'
import App from './App.vue'
import StructureEditWindow from './components/StructureEditWindow'

Vue.component('app-structure', StructureEditWindow)

new Vue({
  el: '#app',
  render: h => h(App)
})
