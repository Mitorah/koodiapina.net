<template>
    <div> 
        <v-btn 
        @click="initialiseArray(); $emit('array-changed', unSortedArray)">
        Generate values</v-btn>
    </div>
</template>

<script>
export default {
    data() {
        return {
            unSortedArray: []
        }
    },
    methods: {
        initialiseArray() {
            this.unSortedArray = this.createUnsortedArray(20)
        },
        createUnsortedArray(numberOfElements) {
            var unsortedArray = []

            for(let i = 1; i < numberOfElements + 1; i++) {
                unsortedArray.push(i)
            }

            unsortedArray = this.scrambleArray(unsortedArray)

            return unsortedArray
        },
        scrambleArray(array) {
            var scrambleCycles = 2000

            for (let i = 0; i < scrambleCycles; i++) {
                var firstIndex = this.getRandomNumber(array.length)
                var secondIndex = this.getRandomNumber(array.length)

                var firstIndexValue = array[firstIndex]
                array[firstIndex] = array[secondIndex]
                array[secondIndex] = firstIndexValue
            }

            return array
        },
        getRandomNumber(max) {
            return Math.floor(Math.random() * Math.floor(max))
        }
    }
}
</script>

<style>

</style>