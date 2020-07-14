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

    it('Create array of certain size', () => {
        for (let i = 1; i < 50; i++) {
            expect(wrapper.vm.createUnsortedArray(i).length).toBe(i)
        }
    })

    // This might not be a good test since it is based in randomness.
    // In theory, this test can fail, even if the function works properly.
    it('Scramble array', () => {
        var newArray = [1,2,3,4,5]
        var scrambledArray = wrapper.vm.scrambleArray(newArray.slice())

        var numberOfScrambled = 0

        for (let i = 0; i < newArray.length; i++) {
            if (newArray[i] != scrambledArray[i]) {
                numberOfScrambled++
            }
        }

        expect(numberOfScrambled > 0).toBe(true)
    })
})