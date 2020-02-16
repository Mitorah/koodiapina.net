Vue.component('meeting_visual_data', {
    template: '<h5>{{ item }}<button v-on:click = "delete_button(item)">Delete</button></h5><br/>',
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
       new_meeting_as_date: Date,
       new_meetings: [Date],
       new_meeting: "",
       meetings: ['one', 'two', 'three', 'four'],
   },
   methods: {
       addmeeting: function() {
           this.new_meetings.push(this.new_meeting_as_date)
           this.new_meeting_as_date = null
       },
       deletemeeting: function(deletedmeeting) {
           this.new_meetings.splice(this.meetings.indexOf(deletedmeeting), 1);
       }
   },

});