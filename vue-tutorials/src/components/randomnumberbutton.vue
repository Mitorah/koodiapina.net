<template>
    <v-app>
        <v-col sm="4">
            <v-btn @click="generateRandomNumber">RNG</v-btn>
            <v-text-field readonly label="random" v-model="randomGeneratedNumber">
            </v-text-field>
            <v-text-field readonly background-color="green" v-model="isPositiveText" v-if="isPositiveNumber > 0">
            </v-text-field>
            <v-text-field readonly background-color="red" v-model="isNegativeText"  v-else-if="isPositiveNumber < 0">
            </v-text-field>
            <v-text-field readonly background-color="blue" v-model="isZero" v-else> This is zero.
            </v-text-field>
            <v-text-field readonly label="[number of generations] average value" v-model="averageNumber">
            </v-text-field>
        </v-col>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            randomGeneratedNumber: 1,
            generatedNumbers: [],
            isPositiveText: "This is positive number",
            isNegativeText: "This is negative number",
            isZero: "This number is zero.",
        }
    },
    methods: {
        generateRandomNumber() {
            this.randomGeneratedNumber = Math.floor((Math.random() * 100)) - 50
            this.generatedNumbers.push(this.randomGeneratedNumber)
        }
    },
    computed: {
        isPositiveNumber: function() {
            return Math.sign(this.randomGeneratedNumber);
        },
        averageNumber: function() {
            var averageNumberGenerated = 0

            for (var index in this.generatedNumbers) {
                averageNumberGenerated += this.generatedNumbers[index]
            }


            
            return "[" + this.generatedNumbers.length + "] " + (this.generatedNumbers.length > 0 ? averageNumberGenerated / this.generatedNumbers.length : 0).toString()
        }
    }
}
</script>

<style>

</style>