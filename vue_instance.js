var vm = new Vue({
    el: "#vue_det",
    data: {
        first_name: "John",
        last_name: "Doe",
        htmlcontent: "<div><h1>Vue Js Template</h1></div>"
    },

    methods: {
        information : function() {
            return "My name is " + this.first_name + " " + this.last_name + ".";
        }
    }
})