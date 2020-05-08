Vue.component('combinationcomponent', {
    template: '<button v-on:click = "callfunction()">Calculate build orders.</button>',
    props: ['structurearray'],
    data: {
        componentresults: [],
    },
    methods: {
        callfunction: function() {
            this.componentresults = [];
            
            this.findallpossiblecombinations(this.structurearray, [], this.structurearray.length);

            this.$emit('getresults', this.componentresults);
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
})