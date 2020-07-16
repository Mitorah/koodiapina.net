<template>
    <v-app>
        <v-col cols="auto">
            <generate-builds @save-orders="saveGeneratedBuildOrders"></generate-builds>
            {{ generatedOrders }}
            <v-btn @click="simulateGame"></v-btn>
            {{ results }}
        </v-col>
    </v-app>
</template>

<script>

import generatebuildordersVue from './generatebuildorders.vue'
import StructureMylly from './structures/structure-mylly'

export default {
    components: {
        'generate-builds': generatebuildordersVue,
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
            var turnData = {
                currentTurn: 0,
                foodUsedPerTurn: 0,
                cleanWater: 2,
                dirtyWater: 0,
                diamond: 0,
                food: 0
            }

            const newStructure = new StructureMylly()

            console.log("Before: " + turnData.cleanWater)

            turnData = newStructure.getOutputDataFromStructure(turnData)

            console.log("After: " + turnData.cleanWater)

        },
    }
}
</script>

<style>

</style>