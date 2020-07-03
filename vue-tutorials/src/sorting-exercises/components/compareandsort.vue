<template>
    <v-app>
        <v-col>
            <v-row>
            <unsorted-array @array-changed="updateArray">
            </unsorted-array>
            </v-row>
            <v-row>
            Unsorted: {{ unsortedArray }}
            </v-row>
            <v-row>
            Sorted: {{sortedArray}}
            </v-row>
            <v-row>
            <v-btn @click="sortArray">Sort by compare</v-btn>
            </v-row>
        </v-col> 
    </v-app>
</template>

<script>
import unsortedarrayVue from './unsortedarray.vue'
export default {
    components: {
        'unsorted-array': unsortedarrayVue
    },
    data() {
        return {
            unsortedArray: [], // [12,2,6,4,3,8,5,9,11,41,212,6,-6],
            sortedArray: []
        }
    },
    methods: {
        updateArray(array) {
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