<template>
    <v-app>
        <v-col
        cols="auto">
        <v-btn @click="showMana()">Pie chart</v-btn>
        <graph-pie
        :width="500"
        :height="500"
        :text-align="'right'"
        :values="ManaResultValues"
        :names="ManaResultNames"
        :active-index="[]"
        :shape="'donut'"
        :show-total-value="true"
        :active-event="'click'"
        :show-text-type="'outside'"
        >
        <tooltip :names="ManaResultNames"></tooltip>
        <legends :names="ManaResultNames"></legends>
        </graph-pie>
        </v-col>
    </v-app>

</template>

<script>
import GraphPie from 'vue-graph/src/components/pie'
export default {
    components: {
        'graph-pie': GraphPie
    },
    props: {
        manaData: Object
    },
    data() {
        return {
            // ManaResultNames: [],
            // ManaResultValues: []
        }
    },
    computed: {
        ManaResultValues() {
            var values = []
            for(let value in this.manaData) {
                values.push(this.manaData[value])
            }
            return values
        },
        ManaResultNames() {
            var names = []
            for (let value in this.manaData) {
                names.push(value)
            }
            return names
        },
    },
    // methods: {
    //     showMana() {
    //         this.ManaResultValues = []
    //         this.ManaResultNames= []
    //         for(let value in this.manaData) {
    //             this.ManaResultNames.push(value)
    //             this.ManaResultValues.push(this.manaData[value])
    //         }
    //     }
    // }

}
</script>

<style>

</style>