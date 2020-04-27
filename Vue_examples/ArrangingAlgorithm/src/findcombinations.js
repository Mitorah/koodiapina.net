Vue.component('combinations', {
    methods:{
        findallpossiblecombinations: function(pool, newpool, wantedlength) {
            if (newpool.length == wantedlength) {
                this.results.push(newpool.slice(0));
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