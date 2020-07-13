<template>
  
</template>

<script>
import structureBaseVue from './structure-base.vue'
export default {
    mixin: [structureBaseVue],
    data() {
        return {
            structureActions: [
                structureAction
            ]
        }
    },
    methods: {
        getOutputFromStructure(inputData) {
            if (inputData.cleanWater >= 2) {
                inputData.cleanWater -= 2
                
                var createdFood = 2 - inputData.dirtyWater < 0 ? 0 : 2 - inputData.dirtyWater

                if (createdFood == 2) {
                    inputData.dirtyWater++
                }

                inputData.food += createdFood
            }

            return inputData
        }
    }
}
</script>

<style>

</style>