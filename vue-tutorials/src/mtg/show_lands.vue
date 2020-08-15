<template>
        <graph-pie
        :width="500"
        :height="500"
                :padding-top="100"
                :padding-bottom="100"
                :padding-left="100"
                :padding-right="100"
        :values="ManaResultValues"
        :names="ManaResultNames"
        :show-total-value="true"
        :active-event="'click'"
        :show-text-type="'outside'"
        >
        </graph-pie>
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
            ManaNameConvert: {
                u: "Blue",
                r: "Red",
                b: "Black",
                w: "White",
                g: "Green"
            },
            ManaColorConvert: {
                u: '#EC2500',
                r: '#ECE100',
                b: '#EC9800',
                w: '#9EDE00',
                g: '#9EDE00'
            }
        }
    },
    computed: {
        ManaResultValues() {
            var values = []
            for(let value in this.manaData) {
                if (this.manaData[value] > 0)
                    values.push(this.manaData[value])
            }            
            return values
        },
        ManaResultNames() {
            var names = []
            for (let value in this.manaData) {
                if(this.manaData[value] > 0)
                    names.push(this.ManaNameConvert[value])
            }
            return names
        },
    }
}
</script>

<style>

</style>