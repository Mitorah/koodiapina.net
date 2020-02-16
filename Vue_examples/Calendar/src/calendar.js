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
       new_meeting: null,
       meetings: [Date],
   },
   methods: {
       addmeeting: function() {
           this.meetings.push(this.new_meeting)
           this.new_meeting = null
       },
       deletemeeting: function(deletedmeeting) {
           this.meetings.splice(this.meetings.indexOf(deletedmeeting), 1);
       }
   },

});