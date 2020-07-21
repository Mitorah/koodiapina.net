<template>
    <v-btn @click="generateBuildOrders(); $emit('save-orders', componentresults)">Generate! ( {{ componentresults.length }} )</v-btn>
</template>

<script>
import StructureKaivo from './structures/structure-kaivo'
import StructureKaivos from './structures/structure-kaivos'
import StructureMetsastaja from './structures/structure-metsastaja'
import StructureMylly from './structures/structure-mylly'
import StructurePato from './structures/structure-pato'
import StructurePelto from './structures/structure-pelto'
import StructureSiilo from './structures/structure-siilo'
import StructureTori from './structures/structure-tori'

export default {
    data() {
        return {
            structurearray: [
                new StructureKaivo(),
                new StructureKaivos(),
                new StructureMetsastaja(),
                new StructureMylly(),
                new StructurePato(),
                new StructurePelto(),
                new StructureSiilo(),
                new StructureTori(),
            ],
            componentresults: []
        }
    },
    methods: {
        generateBuildOrders() {
            this.componentresults = [];
            
            this.findallpossiblecombinations(this.structurearray, [], this.structurearray.length);


            // this.$emit('getresults', this.componentresults);
        },
        findallpossiblecombinations: function(pool, newpool, wantedlength) {
            if (newpool.length == wantedlength) {
                this.componentresults.push(newpool.slice(0));
                newpool.pop()
                return;
            }
            
            for (var i = 0; i < pool.length; i++) {
                if (newpool.includes(pool[i])) {
                        continue;
                    }
                    
                newpool.push(pool[i]);
                    
                this.findallpossiblecombinations(pool, newpool, wantedlength);
            }
                
            newpool.pop();
        },
    }
}
</script>

<style>

</style>