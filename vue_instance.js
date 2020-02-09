var vm = new Vue({
    el: "#vue_det",
    data: {
        first_name: "John",
        last_name: "Doe"
    },

    methods: {
        information : function() {
            return "My name is " + this.first_name + " " + this.last_name + ".";
        }

    }
})