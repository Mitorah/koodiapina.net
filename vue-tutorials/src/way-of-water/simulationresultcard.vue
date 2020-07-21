<template>
    <v-card
    class="mx-auto"
    min-width="340"
    max-width="340">
    <v-toolbar>
        <v-btn icon @click="ShowItem = !ShowItem">
            <v-icon>{{ ShowItem ? 'mdi-chevron-up' : 'mdi-chevron-down'}}</v-icon>
        </v-btn>
        <v-spacer></v-spacer>
        {{ BuildName }}
        <v-spacer></v-spacer>
    </v-toolbar>
    <v-expand-transition>
        <div v-show="ShowItem">
            <v-divider></v-divider>
            <v-card-text
            v-for = "turn in ComputedTurnData"
            :key = "turn.key">
                <v-col>
                    CurrentTurn: {{ turn.CurrentTurn }}
                    cleanWater: {{ turn.CleanWater }}
                    dirtyWater: {{ turn.DirtyWater }}
                </v-col>
                <v-col cols="auto">
                    TurnActionData: {{ turn.TurnActionData }}
                </v-col>
                <v-col cols="auto">
                    BuiltStructures: {{ turn.BuiltStructures }}
                </v-col>
            </v-card-text>

        </div>
    </v-expand-transition>

    </v-card>
</template>

<script>
export default {
    props: {
        TurnData: Object
    },
    data() {
        return {
            ShowItem: false,
            BuildName: "",

            thisTurnData: [],
        }
    },
    computed: {
        ComputedTurnData() {
            return this.SetSimulationResult(this.TurnData)
        }
    },
    methods: {
        SetSimulationResult(simulationResultData) {
            this.BuildName = "Simulation results"

            if (simulationResultData == null ||
                simulationResultData.DataForSimulatedTurns == null) {
                    simulationResultData.DataForSimulatedTurns = {
                        // Make sure these ain't null.
                    }
                }


            for (let i = 0; i < simulationResultData.DataForSimulatedTurns.length; i++) {
                var addedTurn = {
                    CurrentTurn: simulationResultData.DataForSimulatedTurns[i].currentTurn,
                    CleanWater: simulationResultData.DataForSimulatedTurns[i].cleanWater,
                    DirtyWater: simulationResultData.DataForSimulatedTurns[i].dirtyWater,
                    BuiltStructures: simulationResultData.DataForSimulatedTurns[i].thisTurnStructures,
                    TurnActionData: simulationResultData.DataForSimulatedTurns[i].thisTurnActions
                }

                this.thisTurnData.push(addedTurn)
            }

            return this.thisTurnData
        }
    }

}
</script>

<style>

</style>