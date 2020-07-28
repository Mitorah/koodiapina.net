<template>
    <v-app>
        <v-col cols="auto">
            <generate-builds @save-orders="saveGeneratedBuildOrders"></generate-builds>
        </v-col>
        <v-col cols="auto">
            <v-btn @click="simulateAllGames">Simulate game</v-btn>
        </v-col>
        <v-col cols="auto">
            <v-btn @click="sortResultsByCleanWater(true)">Sort by clean water (increasing)</v-btn>
            <v-btn @click="sortResultsByCleanWater(false)">Sort by clean water (decreasing)</v-btn>
        </v-col>
        <v-col cols="auto">
            <v-btn @click="sortResultsByDirtyWater(true)">Sort by dirty water (increasing)</v-btn>
            <v-btn @click="sortResultsByDirtyWater(false)">Sort by dirty water (decreasing)</v-btn>
        </v-col>
        
        <v-row>
            <individual-simulation-results :winningResults="winningResults" :losingResults="losingResults">
            </individual-simulation-results>
            <graphical-simulation-results :winningResults="winningResults" :losingResults="losingResults" ></graphical-simulation-results>
        </v-row>
    </v-app>
</template>

<script>

import generatebuildordersVue from './generatebuildorders.vue'
import individualsimulationresultsVue from './individualsimulationresults.vue'
import StructureVuori from './structures/structure-vuori'
import StructureMeri from './structures/structure-meri'
import graphicalsimulationresultsVue from './graphicalsimulationresults.vue'

export default {
    components: {
        'generate-builds': generatebuildordersVue,
        'individual-simulation-results': individualsimulationresultsVue,
        'graphical-simulation-results': graphicalsimulationresultsVue
    },
    data() {
        return {
            generatedBuildOrders: [[]],
            winningResults: [],
            losingResults: []
        }
    },
    methods: {
        saveGeneratedBuildOrders(buildOrders) {
            this.generatedBuildOrders = buildOrders
        },
        simulateAllGames() {
            this.winningResults = []
            this.losingResults = []

            // for(let i = 0; i < 20000; i++) {
            for(let i = 0; i < this.generatedBuildOrders.length; i++) {
                this.simulateGame(this.generatedBuildOrders[i])
            }

            var sorted = 
            this.winningResults.
            sort(function(b, a) {
                var lastAItem = a.DataForSimulatedTurns[a.DataForSimulatedTurns.length - 1]
                var lastBItem = b.DataForSimulatedTurns[b.DataForSimulatedTurns.length - 1]
                
                var result = lastAItem.cleanWater - lastBItem.cleanWater
                return result != 0 ? result : lastAItem.dirtyWater - lastBItem.dirtyWater
            })

            this.winningResults = sorted

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
            var buildOrderNames = generatedBuildOrder.map(function (item) {
                return item.structureName
            })
            
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

                // Increase turns for each loop to demonstrate when player builds a new structure.
                for (let i = 0; i < turnData.currentTurn; i++) {
                    if (i < generatedBuildOrder.length) {
                        turnData = generatedBuildOrder[i].getOutputDataFromStructure(turnData)
                    }

                    // Check if the simulation has failed between structure simulations
                    if (turnData.gameLost) {
                        break;
                    }
                }

                // Don't run the simulation for Meri if the game has been lost already.
                if (!turnData.gameLost) {
                    turnData = Meri.getOutputDataFromStructure(turnData)
                }

                gameResult.DataForSimulatedTurns.push(Object.assign({}, turnData))
                gameResult.SimulationLostTheGame = turnData.gameLost
                gameResult.SimulationLostReason = turnData.gameLostReason

            }while(turnData.currentTurn < howManyTurnsToSimulate && !gameResult.SimulationLostTheGame)

            // Store simulation result to correct array depending if the game was succesful
            if (!gameResult.SimulationLostTheGame) {
                this.winningResults.push(Object.assign({}, gameResult))
            }
            else {
                this.losingResults.push(Object.assign({}, gameResult))
            }
        },
        sortResultsByCleanWater(increasing) {
            var lastAItem = ""
            var lastBItem = ""

            var sorted = []
            
            sorted = this.winningResults.sort(function(a, b) {
                lastAItem = a.DataForSimulatedTurns[a.DataForSimulatedTurns.length - 1]
                lastBItem = b.DataForSimulatedTurns[b.DataForSimulatedTurns.length - 1]

                return increasing ? lastAItem.cleanWater - lastBItem.cleanWater : lastBItem.cleanWater - lastAItem.cleanWater
            })

            this.winningResults = sorted

            sorted = []

            sorted = this.losingResults.sort(function(a, b) {
                lastAItem = a.DataForSimulatedTurns[a.DataForSimulatedTurns.length - 1]
                lastBItem = b.DataForSimulatedTurns[b.DataForSimulatedTurns.length - 1]

                return increasing ? lastAItem.cleanWater - lastBItem.cleanWater : lastBItem.cleanWater - lastAItem.cleanWater
            })

            this.losingResults = sorted
        },
        sortResultsByDirtyWater(increasing) {
            var lastAItem = ""
            var lastBItem = ""

            var sorted = []

            sorted = this.winningResults.sort(function(a,b) {
                lastAItem = a.DataForSimulatedTurns[a.DataForSimulatedTurns.length - 1]
                lastBItem = b.DataForSimulatedTurns[b.DataForSimulatedTurns.length - 1]

                return increasing ? lastAItem.dirtyWater - lastBItem.dirtyWater : lastBItem.dirtyWater - lastAItem.dirtyWater
            })

            this.winningResults = []
            this.winningResults = sorted
            sorted = []

            sorted = this.losingResults.sort(function(a,b) {
                lastAItem = a.DataForSimulatedTurns[a.DataForSimulatedTurns.length - 1]
                lastBItem = b.DataForSimulatedTurns[b.DataForSimulatedTurns.length - 1]

                return increasing ? lastAItem.dirtyWater - lastBItem.dirtyWater : lastBItem.dirtyWater - lastAItem.dirtyWater
            })


            this.losingResults = []
            this.losingResults = sorted
        }   
    }
}
</script>

<style>

</style>