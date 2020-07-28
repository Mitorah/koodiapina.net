<template>
    <v-app>
        <v-col
        cols="auto">
        <v-btn @click="sortWithWinCondition()">Pie chart</v-btn>
        <graph-pie
        :width="500"
        :height="500"
        :text-align="'right'"
        :values="GameResultData"
        :names="GameResultNames"
        :active-index="[]"
        :shape="'donut'"
        :show-total-value="true"
        :active-event="'click'"
        :show-text-type="'outside'"
        >
        <tooltip :names="GameResultNames"></tooltip>
        <legends :names="GameResultNames"></legends>
        </graph-pie>
        </v-col>
    </v-app>
</template>

<script>
import GraphPie from 'vue-graph/src/components/pie'

export default {
    components: {
        'graph-pie': GraphPie,
    },
    props: {
        winningResults : Array,
        losingResults: Array
    },
    data() {
        return {
            GameResultNames: [],
            GameResultData: []
        }
    },
    methods: {
        sortWithWinCondition() {
            for (let i = 0; i < this.winningResults.length; i++) {
                // this.GameResultData[0] += 1
                if (!this.GameResultNames.includes("Game won")) {
                    this.GameResultNames.push("Game won")
                    this.GameResultData.push(0)
                }

                this.GameResultData[this.GameResultNames.indexOf("Game won")] += 1

            }
            for (let i = 0; i < this.losingResults.length; i++) {
                // this.GameResultData[1] += 1
                
                if (!this.GameResultNames.includes("Lost on turn " + this.losingResults[i].DataForSimulatedTurns.length)) {
                    this.GameResultNames.push("Lost on turn " + this.losingResults[i].DataForSimulatedTurns.length)
                    this.GameResultData.push(0)
                }

                this.GameResultData[this.GameResultNames.indexOf("Lost on turn " + this.losingResults[i].DataForSimulatedTurns.length)] += 1
            }
        }
    }
    
}
</script>

<style>

</style>