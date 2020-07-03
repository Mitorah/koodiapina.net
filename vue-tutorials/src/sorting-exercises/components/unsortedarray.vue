<template>
    <v-app>
        <!-- {{ createUnsortedArray(1000) }} -->
    </v-app>
</template>

<script>
export default {
    data() {
        return {
        }
    },
    methods: {
        createUnsortedArray(numberOfElements) {
            var unsortedArray = []

            for(let i = 0; i < numberOfElements; i++) {
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