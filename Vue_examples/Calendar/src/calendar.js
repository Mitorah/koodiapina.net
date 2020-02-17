Vue.component('meeting_visual_data', {
    template: '<h5>{{' + 
    'item.name }}: {{item.start_time}} - {{item.end_time}}, {{item.date}} <button v-on:click = "delete_button(item)">Delete</button></h5><br/>',
    props: ['item'],
    methods: {
        delete_button: function(mt) {
            this.$emit('delete_meeting', mt);
        }
    },
});

var cal = new Vue({
   el: '#calendar',
   data: {
       new_meeting_id: "",
       new_meeting_date: null,
       new_meeting_start_time: null,
       new_meeting_end_time: null,
       meetings: [[]],
   },
   methods: {
       addmeeting: function() {
            this.meetings.push({
                name: this.new_meeting_id,
                date: this.new_meeting_date,
                start_time: this.new_meeting_start_time,
                end_time: this.new_meeting_end_time,
            });

            this.new_meeting_id = ""
            this.new_meeting_date = null
            this.new_meeting_start_time = null
            this.new_meeting_end_time = null
       },
       deletemeeting: function(deletedmeeting) {
           this.meetings.splice(this.meetings.indexOf(deletedmeeting), 1);
       },
   },

});

