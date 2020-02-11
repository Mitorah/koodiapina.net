var cal = new Vue({
    el: "#vue_calendar",
    data: {
        name: "",
        startTime: [],
        endTime: []
    },
    methods: {
        addNewMeeting: function(fstart, fend) {
            startTime.push(fstart);
            endTime.push(fend);
        }
    }
})