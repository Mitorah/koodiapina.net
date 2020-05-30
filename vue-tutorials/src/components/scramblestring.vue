<template>
    <div>
        <input size="50" v-model="inputMessage" @keypress="scramblestring(inputMessage)">
        <br/>
        <span>Scrambled: {{ scrambledMessage }}</span>
    </div>
</template>

<script>
export default {
    data() {
        return {
            inputMessage: "This is message that will be scrambled!",
            scrambledMessage: ""
        }
    },
    methods: {
        scramblestring(input) {
            let result = [];
            let splitted = input    .split('');

            while (splitted.length > 0)
            {
                let rng = Math.floor(Math.random() * splitted.length);
                result.push(splitted[rng]);
                splitted.splice(rng, 1);
            }

            this.scrambledMessage = result.join('');
            
        }
    }
}
</script>

<style>

</style>