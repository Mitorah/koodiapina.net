<template>
    <v-card
    class="mx-auto"
    min-width="340"
    max-width="840">
        <v-toolbar>
            <v-btn @click="ShowAllTurns = ShowItem ? false : ShowAllTurns; ShowItem = !ShowItem">
            {{ CompactLastResultData }} - {{ BuildName }}
            </v-btn>
            <v-btn icon @click="ShowItem = true; ShowAllTurns = !ShowAllTurns">
                <v-icon>{{ ShowAllTurns ? 'mdi-collapse-all' : 'mdi-expand-all'}}</v-icon> 
            </v-btn>
        </v-toolbar>
    
        <v-expand-transition>
            <div 
            v-show="ShowItem || ShowAllTurns">
                <v-divider></v-divider>
                <v-card
                min-width="340"
                max-width="840"
                v-for = "turn in ComputedTurnData"
                :key = "turn.key">
                    <v-toolbar>
                        <v-btn rounded color="blue" @click="turn.ShowItem = !turn.ShowItem;">
                        {{turn.CleanWater}}/{{turn.DirtyWater}}  {{ turn.BuiltStructures }}
                        </v-btn>
                    </v-toolbar>
                    <v-expand-transition>
                        <div
                        v-if="turn.ShowItem || ShowAllTurns">
                            <v-card-text>
                                TurnActionData: {{ turn.TurnActionData }}
                            </v-card-text>
                            <v-card-text>
                                BuiltStructures: {{ turn.BuiltStructures }}
                            </v-card-text>
                            <v-card-text>
                                Turn: {{ turn.CurrentTurn }}
                                CleanWater: {{ turn.CleanWater }}
                                DirtyWater: {{ turn.DirtyWater }}
                            </v-card-text>
                        </div>
                    </v-expand-transition>
                </v-card>
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
            ShowAllTurns: false,
            BuildName: "",

            thisTurnData: [],
        }
    },
    computed: {
        ComputedTurnData() {
            return this.SetSimulationResult(this.TurnData)
        },
        CompactLastResultData() {
            var lastData = this.ComputedTurnData[this.ComputedTurnData.length - 1]
            return `${this.ComputedTurnData.length}: ${lastData.CleanWater}/${lastData.DirtyWater}`
        }
    },
    methods: {
        SetSimulationResult(simulationResultData) {
            this.thisTurnData = []
            
            if (simulationResultData == null ||
                simulationResultData.DataForSimulatedTurns == null) {
                    simulationResultData.DataForSimulatedTurns = {
                        // Make sure these ain't null.
                    }
                }

            this.BuildName = simulationResultData.StructureNames


            for (let i = 0; i < simulationResultData.DataForSimulatedTurns.length; i++) {
                var addedTurn = {
                    ShowItem: false,
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