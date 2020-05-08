Vue.component('visualstructurecomponent', {
    template: '<h5>{{ structuredata[0] }} <br/> <button v-on:click = "editstructure(structuredata)"> Edit </button> <button v-on:click = "removefromstructurelist(structuredata)">Remove</button></h5><br/>',
    props: ['structuredata'],
    methods: {
        removefromstructurelist: function(item) {
            this.$emit('removefromstructures', item);
        }
    },
})