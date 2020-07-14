import { mount } from '@vue/test-utils'
import testedComponent from './testedclass.vue'

const wrapper = mount(testedComponent)

console.log(wrapper)

describe('testedComponent', () => {
    

    it('has created hook', () => {
        expect(typeof testedComponent.created).toBe('function')
    })

    it ('renders correct text', () => {
        expect(wrapper.text ()).toBe('Bye')
    })
})