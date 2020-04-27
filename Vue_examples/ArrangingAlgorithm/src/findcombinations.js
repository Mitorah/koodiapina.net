Vue.component('combinationcomponent', {
    template: '<button v-on:click = "callfunction()">Calculate</button>',
    data: {
        componentresults: [],
    },
    methods: {
        callfunction: function() {
            var farray = [];
            farray.push(1)
            farray.push(2)
            farray.push([4,5,6])
            farray.push(11)

            this.componentresults = [];

            this.findallpossiblecombinations(farray, [], farray.length);

            this.componentresults.unshift(this.componentresults.length);
        
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