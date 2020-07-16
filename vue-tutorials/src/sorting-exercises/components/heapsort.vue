<template>
    <v-row>
        <v-col cols="12" md="4">
            <unsorted-array @array-changed="initialiseUnsortedArray">
            </unsorted-array>
        </v-col>
        <v-col cols="12" md="2">
            <v-row>
                <v-btn @click="sortArray">Heap sort</v-btn>
            </v-row>
        </v-col>
        <v-col cols="12" md="2">
            <v-row>
                Unsorted: {{ unsortedArray }}
            </v-row>
        </v-col>
        <v-col cols="12" md="2">
            <v-row>
                Sorted: {{ sortedArray}}
            </v-row>
        </v-col>
    </v-row>
</template>

<script>
import unsortedarrayVue from './unsortedarray.vue'
export default {
    components: {
        'unsorted-array': unsortedarrayVue
    },
    data() {
        return {
            unsortedArray: [],
            sortedArray: [],
        }
    },
    methods: {
        initialiseUnsortedArray(array) {
            this.unsortedArray = array
        },
        sortArray() {
            this.sortedArray = this.recursiveSortArray(this.unsortedArray.slice(), 0, 1, 10)
        },
        recursiveSortArray(array, i, j, delay) {
            if (array[j] > array[i]) {
                var cachedSwapValue = array[i]
                array[i] = array[j]
                array[j] = cachedSwapValue
            }

            if (j < array.length)
                j++
            else {
                i++
                j = 0
            }

            this.sortedArray = array.slice()

            if (i < array.length) {
                window.setTimeout(() =>
                this.recursiveSortArray(array, i, j, delay)
                ,delay)
            }

            return array
        }
    }

}
</script>

<style>

</style>