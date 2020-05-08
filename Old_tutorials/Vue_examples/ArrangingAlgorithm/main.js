var vueApp = new Vue({
    el: '#playtester',
    data: {
        results: [],
        structures: [],
    },
    methods: {
        setcombinationarray: function(newresults) {
            this.results = newresults;
        },
        setstructurearray: function(newstructures) {
            this.structures = newstructures;
        },
        addtostructurearray: function(structurename, structurefunction) {
            if (structurename == "" || structurefunction == "")
                return;

            this.structures.push([structurename, structurefunction]);
            this.new_structure_name = "";
            this.new_structure_function = "";
        },
        removefromstructurearray: function(structureToRemove) {
            console.log("Removing "+ structureToRemove);
            this.structures.splice(this.structures.indexOf(structureToRemove), 1);
        },
        createfunctionfromstring: function(inputstring) {
            return Function(inputstring);
        }
    }

})
