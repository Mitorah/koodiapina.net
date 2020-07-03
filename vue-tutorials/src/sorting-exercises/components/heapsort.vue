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
            sortedArray: []
        }
    },
    methods: {
        initialiseUnsortedArray(array) {
            this.unsortedArray = array
        },
        sortArray() {
            this.sortedArray = this.unsortedArray.slice()

            var cachedSwapValue = 0

            for (let i = 0; i < this.sortedArray.length; i++) {

                for (let j = i+1; j < this.sortedArray.length; j++) {
                    if (this.sortedArray[j] < this.sortedArray[i]) {
                        cachedSwapValue = this.sortedArray[i]
                        this.sortedArray[i] = this.sortedArray[j]
                        this.sortedArray[j] = cachedSwapValue
                    }
                }
            }
        }
    }

}
</script>

<style>

</style>