<template>
  
</template>

<script>
import structureBaseVue from './structure-base.vue'
export default {
    mixin: [structureBaseVue],
    data() {
        return {

        }
    },
    getOutputDataFromStructure(inputData) {
        inputData.food = 0
        inputData.diamond = 0
        inputData.cleanWater = 4 + Math.ceil(inputData.cleanWater / 2)
        inputData.dirtyWater = inputData.cleanWater >= 6 ? 1 : 0

        return inputData
    }
}
</script>

<style>

</style>