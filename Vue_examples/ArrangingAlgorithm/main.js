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
        testing: []
    },
    methods: {
        setresults: function(newresults) {
            this.results = newresults;
        },
        
        createfunctionfromstring: function(inputstring) {
            return Function(inputstring);
        }
    }

})
