import { createLocalVue, shallowMount } from '@vue/test-utils'
import UnsortedArray from '../unsortedarray.vue'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)
Vue.config.ignoredElements = [
    'v-row',
    'v-col',
    'v-text-field',
    'v-btn'
]

const wrapper = shallowMount(UnsortedArray)

describe('Unsorted array tests', () => {

    it('Creates array of size', () => {
        wrapper.vm.initialiseArray()

        expect(wrapper.vm.unSortedArray.length).toBe(25)
    })
})