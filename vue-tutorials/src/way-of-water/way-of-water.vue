<template>
    <v-app>
        <v-col cols="auto">
            <generate-builds @save-orders="saveGeneratedBuildOrders"></generate-builds>
        </v-col>
        <v-col cols="auto">
            <v-btn @click="simulateGames">Simulate game</v-btn>
        </v-col>
        <v-row>
        <v-col
        cols="auto"
        >
        Winning results ({{winningResults.length}})
        <!-- <simulation-result
        v-for = 'data in winningResults'
        :key = 'data.key'
        :TurnData = 'data'>
        </simulation-result> -->
        </v-col>
        <v-col
        cols="auto">
        Losing results ({{losingResults.length}})
        <!-- <simulation-result
        v-for = 'data in losingResults'
        :key = 'data.key'
        :TurnData = 'data'>
        </simulation-result> -->
        </v-col>
        </v-row>
    </v-app>
</template>

<script>

import generatebuildordersVue from './generatebuildorders.vue'
// import simulationresultcardVue from './simulationresultcard.vue'
import StructureVuori from './structures/structure-vuori'
import StructureMeri from './structures/structure-meri'

export default {
    components: {
        'generate-builds': generatebuildordersVue,
        // 'simulation-result': simulationresultcardVue
    },
    data() {
        return {
            buildOrdersGenerated: false,

            generatedBuildOrders: [[]],
            winningResults: [{}],
            losingResults: [[{}]]
        }
    },
    methods: {
        saveGeneratedBuildOrders(buildOrders) {
            this.generatedBuildOrders = buildOrders
            this.buildOrdersGenerated = true
        },
        simulateGames() {
            this.winningResults = []

            for(let i = 0; i < this.generatedBuildOrders.length; i++) {
                this.simulateGame(this.generatedBuildOrders[i])
            }
        },
        simulateGame(generatedBuildOrder) {
            var howManyTurnsToSimulate = generatedBuildOrder.length
            var turnData = {
                thisTurnActions: [],
                thisTurnStructures: [],
                currentTurn: 0,
                foodUsedPerTurn: 0,
                cleanWater: 0,
                dirtyWater: 0,
                diamond: 0,
                food: 0,
                gameLost: false,
                gameLostReason: ""
            }
            var buildOrderNames = []
            var gameResult = {
                StructureNames: buildOrderNames,
                SimulationLostTheGame: false,
                SimulationLostReason: "",
                DataForSimulatedTurns: []
            }

            // Create simulation data for individual structures.
            for (let i = 0; i < generatedBuildOrder.length; i++) {
                generatedBuildOrder[i].generateGameActions(howManyTurnsToSimulate)
            }

            var Vuori = new StructureVuori()
            var Meri = new StructureMeri()

            // Do the simulation
            do {
                turnData = Vuori.getOutputDataFromStructure(turnData)

                for (let i = 0; i < turnData.currentTurn; i++) {
                    if (i < generatedBuildOrder.length) {
                        turnData = generatedBuildOrder[i].getOutputDataFromStructure(turnData)
                    }
                }

                turnData = Meri.getOutputDataFromStructure(turnData)

                gameResult.DataForSimulatedTurns.push(Object.assign({}, turnData))
                gameResult.SimulationLostTheGame = turnData.gameLost
                gameResult.SimulationLostReason = turnData.gameLostReason

            }while(turnData.currentTurn < howManyTurnsToSimulate && !gameResult.SimulationLostTheGame)

            if (!gameResult.SimulationLostTheGame) {
                this.winningResults.push(Object.assign({}, gameResult))
            }
            else {
                this.losingResults.push(Object.assign({}, gameResult))
            }
        },
        startSimulatedTurn() {

        },
        simulateTurn() {

        },
        endSimulatedTurn() {

        },
    }
}
</script>

<style>

</style>