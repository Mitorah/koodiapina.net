<template>
    <v-app>
        <v-col sm="2">
        <v-text-field label="Write here!" v-model="inputMessage" @keypress="scramblestring(inputMessage)">
        </v-text-field>
        <v-text-field label="Scrambled" readonly v-model="scrambledMessage">
        </v-text-field>
        </v-col>
        <br/>
    </v-app>
</template>

<script>
export default {
    data() {
        return {
            inputMessage: "",
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