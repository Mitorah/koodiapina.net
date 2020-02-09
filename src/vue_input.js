var vi = new VTTCue({
    el: "#vue_input",
    data: {
        first_name: "",
        last_name: "",
        age: Number
    },
    methods: {
        changefirstname: function(fname) {
            this.first_name = fname
        },
        changelastname: function(lname) {
            this.last_name = lname
        }
    }
})