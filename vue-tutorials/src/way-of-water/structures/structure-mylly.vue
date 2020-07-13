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
    methods: {
        getOutputDataFromStucture(inputData) {
            if (inputData.cleanWater >= 1) {
                inputData.cleanWater--

                if (inputData.food >= 2) {
                    inputData.food -= 2

                    var createdFood = 3 - inputData.dirtyWater < 0 ? 0 : 3 - inputData.dirtyWater

                    inputData.food += createdFood
                }
            }

            return inputData
        }
    }
}
</script>

<style>

</style>