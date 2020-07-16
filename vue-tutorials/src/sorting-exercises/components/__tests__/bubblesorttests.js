import { shallowMount } from '@vue/test-utils'
import BubbleSort from '../bubblesort.vue'
import Vue from 'vue'
import Vuetify from 'vuetify'

Vue.use(Vuetify)
Vue.config.ignoredElements = [
    'v-col',
    'v-row',
    'v-card',
    'v-card-title',
    'v-btn'
]

const wrapper = shallowMount(BubbleSort)

describe('Sorting exercise tests', () => {
    
    it('Setting array correctly.', () => {
        var newArray = [2, 3, 5, 7, 11, 4, 1]
        
        wrapper.vm.initialiseUnsortedArray(newArray)

        expect(wrapper.vm.unsortedArray == newArray).toBe(true)
    })

    it('Clicking button calls sortArray.', () => {
        // -------------------------------------------------
        // Need to figure out how to call v-btn, since it 
        // seems that it cannot be found with 'wrapper.find'
        // -------------------------------------------------

        // const myMock = jest.fn()

        // const buttonWrapper = shallowMount(BubbleSort, {
        //     methods: {
        //         sortArray: myMock
        //     }
        // })
        
        // buttonWrapper.find('v-btn').trigger('click')
        // console.log(myMock.mock.calls)
        // expect(myMock.mock.calls.length).toBe(1)

    })
})