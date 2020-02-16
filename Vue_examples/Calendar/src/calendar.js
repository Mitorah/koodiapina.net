Vue.component('meeting_visual_data', {
    template: '<h5>{{ item }}</h5><button v-on:click = "deletemeeting(item)">Delete</button><br/>',
    data: function() {
        return {
            counter: 0
        }
    },
    props: ['item'],
    methods: {
        display_meeting: function(mt) {
            this.$emit('addmeeting', mt);
        }
    },
});

var cal = new Vue({
   el: '#calendar',
   data: {
       meetings: ['one', 'two','three','four'],
   },
   methods: {
       meetingdisp: function(mt) {
           // Click function
       },
       addmeeting: function(newmeeting) {
           meetings.push(mt)
       },
       deletemeeting: function(deletedmeeting) {
           this.meetings.splice(this.meetings.indexOf(deletedmeeting), 1);
       }
   },

});