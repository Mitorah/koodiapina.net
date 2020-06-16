<template>
    <div>
        <v-btn @click="generateRandomNumber">RNG</v-btn>
        <v-col sm="1">
        <v-text-field v-model="randomGeneratedNumber">
        </v-text-field>
        </v-col>
        <v-col sm="2">
        <v-text-field readonly v-model="isPositiveText" v-if="isPositiveNumber > 0">
        </v-text-field>
        <v-text-field readonly v-model="isNegativeText"  v-else-if="isPositiveNumber < 0">
        </v-text-field>
        <v-text-field readonly v-model="isZero" v-else> This is zero.
        </v-text-field>

        </v-col>
    </div>
</template>

<script>
export default {
    data() {
        return {
            randomGeneratedNumber: 1,
            isPositiveText: "This is positive number",
            isNegativeText: "This is negative number",
            isZero: "This number is zero.",
        }
    },
    methods: {
        generateRandomNumber() {
            this.randomGeneratedNumber = Math.floor((Math.random() * 100)) - 50;
        }
    },
    computed: {
        isPositiveNumber: function() {
            return Math.sign(this.randomGeneratedNumber);
        },
    }
}
</script>

<style>

</style>