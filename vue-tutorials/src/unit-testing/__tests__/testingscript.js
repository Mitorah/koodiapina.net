import { shallowMount } from '@vue/test-utils'
import TestedComponent from './testedclass.vue'
import Vuetify from 'vuetify'
import Vue from 'vue'

Vue.use(Vuetify)
Vue.config.ignoredElements = [
    'v-col',
    'v-row',
    'v-text-field',
    'v-btn'
]

const wrapper = shallowMount(TestedComponent)

describe('TestedComponent', () => {

    it('has created hook', () => {
        expect(typeof TestedComponent.created).toBe('function')
    })

    it('has created function', () => {
        expect(typeof wrapper.vm.changeMessage).toBe('function')
    })

    it ('renders correct text', () => {
        expect(wrapper.text ()).toBe('Bye')
    })

    it ('changes message', () => {
        var newMessage = "This is new message"
        wrapper.vm.changeMessage(newMessage)
        // TestedComponent.changeMessage(newMessage)
        expect(wrapper.vm.message).toBe(newMessage)

    })
})