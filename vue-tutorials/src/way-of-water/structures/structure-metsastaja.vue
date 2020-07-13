<template>
  
</template>

<script>
import structureBaseVue from './structure-base.vue'
export default {
    mixin: [structureBaseVue],
    data() {
        return {
            structureActions: []
        }
    },
    methods: {
        getOutputFromStructure(inputData) {
            if (storedData.cleanWater == 0 && inputData.cleanWater > 0) {
                storedData.cleanWater++
                inputData.cleanWater--
            }
            else if (storedData.cleanWater > 0) {
                storedData.cleanWater--
                inputData.food++
            }

            return inputData
        }
    }
}
</script>

<style>

</style>