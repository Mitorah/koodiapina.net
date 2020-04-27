import { findallpossiblecombinations } from './src'

var vueApp = new Vue({
    el: '#playtester',
    data: {
        index: 0,
        numbers: [
        1,
        2,
        [3,4],
        5,
        6,
        ],
        results: [],
    },
    methods: {
        findresults: function() {
            
            var farray = [];
            farray.push(1)
            farray.push(2)
            farray.push([3,4])
            farray.push(5)
            farray.push(6)

            this.results = [];

            findallpossiblecombinations(farray, [], farray.length);

            this.results.unshift(this.results.length);
            
            // for (var i = 0; i < this.results.length - 1; i++) {
            //     var tmpfunc = this.createfunctionfromstring(this.results[i]);
            //     if (typeof tmpfunc === 'function') {
            //         tmpfunc();
            //     }
            // }
            
        },
        createfunctionfromstring: function(inputstring) {
            return Function(inputstring);
        }
    }

})