<template>
    <v-app>
        <v-col cols="auto">
            <generate-builds @save-orders="saveGeneratedBuildOrders"></generate-builds>
            {{ generatedOrders }}
            <v-btn @click="simulateGame"></v-btn>
            {{ results }}
        </v-col>
        <!-- <structure-siilo></structure-siilo> -->
    </v-app>
</template>

<script>
import generatebuildordersVue from './generatebuildorders.vue'
import structureSiiloVue from './structures/structure-siilo.vue'

export default {
    components: {
        'generate-builds': generatebuildordersVue,
        // 'structure-siilo': structureSiiloVue
    },
    data() {
        return {
            generatedOrders: [[]],
            results: {}
        }
    },
    methods: {
        saveGeneratedBuildOrders(buildOrders) {
            this.generatedOrders = buildOrders
        },
        simulateGame() {
            // var turnData = {
            //     currentTurn: 0,
            //     foodUsedPerTurn: 0,
            //     cleanWater: 0,
            //     dirtyWater: 0,
            //     diamond: 0,
            //     food: 0
            // }

            console.log(structureSiiloVue.methods)

            
        },
    }
}
</script>

<style>

</style>