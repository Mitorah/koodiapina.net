<template>
    <div>
        <v-col dense>
            <v-row>
                <v-col cols="12" md="4">
                    <v-text-field v-model="arraySize" label="Amount of values in array"></v-text-field>
                </v-col>
                <v-col cols="12" md="4">
                    <v-btn
                    @click="initialiseArray(); $emit('array-changed', unSortedArray)">
                    Generate {{ arraySize }} values</v-btn>
                </v-col>
            </v-row>
        </v-col>
    </div>
</template>

<script>
export default {
    data() {
        return {
            arraySize: 5,
            unSortedArray: []
        }
    },
    methods: {
        initialiseArray() {
            this.unSortedArray = this.createUnsortedArray(Number(this.arraySize))
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