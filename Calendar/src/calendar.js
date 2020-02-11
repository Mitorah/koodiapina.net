Vue.component('calendar-item', {
    template: '\
    <li>\
        {{ startTime }}\
        <button v-on:click="$emit(\'remove\')">Derp</button>\
    </li>\
    ',
    props: ['startTime']
})

var cal = new Vue({
    el: "#vue_calendar",
    data: {
        name: "",
        newStartTime: Date,
        newEndTime: Date,
        meetings: []
    },
    methods: {
        addNewMeeting: function() {
            this.meetings.push({
                startTime: this.newStartTime,
                endTime: this.newEndTime
            })
            this.newStartTime = "",
            this.newEndTime = ""
        }
    }
})