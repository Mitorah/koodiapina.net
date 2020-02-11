var cal = new Vue({
    el: "#vue_calendar",
    data: {
        name: "",
        startTime,
        endTime,
        startTimeArray: [],
        endTimeArray: []
    },
    methods: {
        addNewMeeting: function() {
            startTimeArray.push(startTime);
            endTimeArray.push(endTime);
            startTime = "",
            endTime = ""
        }
    }
})