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
        this.storedData.dirtyWater += inputData.dirtyWater

        this.checkLosingConditions()

        return inputData
    },
    checkLosingConditions() {
        if (this.storedData.dirtyWater >= 6) {
            // Lost the game
        }
    },
}
</script>

<style>

</style>