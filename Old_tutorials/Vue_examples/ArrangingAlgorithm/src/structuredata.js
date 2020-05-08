Vue.component ('addstructure', {
    template: '<h5>Name: <input type="text" v-model = "sname" /> <br/>' +
        '<button v-on:click="createnewstructure(sname)">Save</button></h5>',
    props: ["sname"],
    data: {
        structurename: "",
        input: [],
        output: [],
    },
    methods: {
        createnewstructure: function(item) {
            // this.input.push(item);
            // console.log(this.input);
        }
    }
    
})