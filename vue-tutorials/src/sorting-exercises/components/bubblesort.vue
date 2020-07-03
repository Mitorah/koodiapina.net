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
            this.sortedArray = this.unsortedArray.slice()

            
            for (let i = 1; i < this.sortedArray.length; i++) {
                if (this.sortedArray[i] < this.sortedArray[i-1]) {
                    var firstIndexValue = this.sortedArray[i]
                    this.sortedArray[i] = this.sortedArray[i-1]
                    this.sortedArray[i-1] = firstIndexValue
                    
                    i = 0
                }
            }

            return this.sortedArray
        }
    }
}
</script>

<style>

</style>