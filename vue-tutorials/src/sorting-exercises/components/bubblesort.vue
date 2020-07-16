<template>
        <v-row>
            <v-col cols="12" md="4">
                <unsorted-array @array-changed="initialiseUnsortedArray">
                </unsorted-array>
            </v-col>
            <v-col cols="12" md="2">
                <v-row>
                    <v-btn @click="sortArray">Bubble sort</v-btn>
                </v-row>
            </v-col>
            <v-col cols="12" md="2">
                <v-row>
                    Unsorted: {{ unsortedArray }}
                </v-row>
            </v-col>
            <v-col cols="12" md="2">
                <v-row>
                    Sorted: {{sortedArray}}
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
            sortedArray: []
        }
    },
    methods: {
        initialiseUnsortedArray(array) {
            this.unsortedArray = array
        },
        sortArray() {
            this.recursiveSortArray(this.unsortedArray.slice(), 0, 10)
        },
        recursiveSortArray(array, i, delay) {
            this.sortedArray = array.slice()

            i = i == 0 ? i = 1 : i

            if (array[i] < array[i-1]) {
                var cachedValue = array[i]
                array[i] = array[i-1]
                array[i-1] = cachedValue

                i = 0
                window.setTimeout(() => 
                    this.recursiveSortArray(array, i, delay)
                , delay)
            }
            else if (i < array.length - 1) {
                i++
                window.setTimeout(() => 
                    this.recursiveSortArray(array, i, delay)
                ,delay)
            }
            else
                return
        }
    }
}
</script>

<style>

</style>