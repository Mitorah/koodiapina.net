<template>
    <v-app>
            <v-col cols="auto">
                <v-btn @click="sortResultsByCleanWater(true)">Sort by clean water (increasing)</v-btn>
                <v-btn @click="sortResultsByCleanWater(false)">Sort by clean water (decreasing)</v-btn>
            </v-col>
            <v-col cols="auto">
                <v-btn @click="sortResultsByDirtyWater(true)">Sort by dirty water (increasing)</v-btn>
                <v-btn @click="sortResultsByDirtyWater(false)">Sort by dirty water (decreasing)</v-btn>
            </v-col>
        <v-row>
            <v-col cols="auto">
                Winning results ({{winningResults.length}}) {{winningArrayPageNumber}}
                <v-btn icon @click="updateWinningPageCount(-1)">
                    <v-icon>{{"mdi-minus-box"}}</v-icon>
                </v-btn>
                <v-btn icon @click="updateWinningPageCount(1)">
                    <v-icon>{{"mdi-plus-box"}}</v-icon>
                </v-btn>
                <simulation-result-card
                v-for = 'data in computedWinningResultPages[currentWinningResultPage]'
                :key = 'data.key'
                :TurnData = 'data'>
                </simulation-result-card>
            </v-col>

            <v-col cols="auto">
                Losing results ({{losingResults.length}}) {{losingArrayPageNumber}}
                <v-btn icon @click="updateLosingPageCount(-1)">
                    <v-icon>{{"mdi-minus-box"}}</v-icon>
                </v-btn>
                <v-btn icon @click="updateLosingPageCount(1)">
                    <v-icon>{{"mdi-plus-box"}}</v-icon>
                </v-btn>
                <simulation-result-card
                v-for = 'data in computedLosingResultPages[currentLosingResultPage]'
                :key = 'data.key'
                :TurnData = 'data'>
                </simulation-result-card>
            </v-col>
        </v-row>
    </v-app>
</template>

<script>
import simulationresultcardVue from './simulationresultcard.vue'

export default {
    components: {
        'simulation-result-card': simulationresultcardVue
    },
    props: {
        winningResults: Array,
        losingResults: Array
    },
    data() {
        return {
            winningResultPages: [],
            losingResultPages: [],
            currentWinningResultPage: 0,
            currentLosingResultPage: 0         
        }
    },
    computed: {
        computedWinningResultPages() {
            var results = this.winningResults.slice()
            var pagedResult = []
            
            do {
                pagedResult.push(results.splice(0, Math.min(results.length, 10)))
            } while (results.length > 0)
            
            return pagedResult
        },
        computedLosingResultPages() {
            var results = this.losingResults.slice()
            var pagedResult = []

            do {
                pagedResult.push(results.splice(0, Math.min(results.length, 10)))
            } while(results.length > 0)

            return pagedResult
        },
        winningResultArray() {
            return this.winningResults.slice(this.currentWinningResultPage, this.currentWinningResultPage + 10)

        },
        losingResultArray() {
            return this.losingResults.slice(this.currentLosingResultPage, this.currentLosingResultPage + 10)
        },
        winningArrayPageNumber() {
            return `${this.currentWinningResultPage+1}/${this.computedWinningResultPages.length}`
        },
        losingArrayPageNumber() {
            return `${this.currentLosingResultPage+1}/${this.computedLosingResultPages.length}`
        }
    },
    methods: {
        updateWinningPageCount(modifier) {
            this.currentWinningResultPage += modifier
            this.currentWinningResultPage = this.clampValue(this.currentWinningResultPage, 0, this.computedWinningResultPages.length - 1)
        },
        updateLosingPageCount(modifier) {
            this.currentLosingResultPage += modifier
            this.currentLosingResultPage = this.clampValue(this.currentLosingResultPage, 0, this.computedLosingResultPages.length - 1)
        },
        clampValue(value, min, max) {
            return Math.max(Math.min(value, max), min)
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