<template>
    <div>
        <button @click="generateRandomNumber">RNG</button>
        <span>: {{ randomGeneratedNumber }}</span>
        <span v-if="isPositiveNumber > 0"> This is positive number.</span>
        <span v-else-if="isPositiveNumber < 0"> This is negative number.</span>
        <span v-else> This is zero.</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            randomGeneratedNumber: 1,
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
        }
    }
}
</script>

<style>

</style>