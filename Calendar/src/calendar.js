var cal = new Vue({
    el: "#vue_calendar",
    data: {
        name: "",
        meeting: [
            { startTime : Date },
            { endTime : Date }
        ]
    },
    methods: {
        addNewMeeting: function(fstart, fend) {
            this.meeting.push({
                startTime = fstart, 
                endTime = fend
            });
        },
        getAllMeetings: function() {
            return this.meeting
        }
    }
})