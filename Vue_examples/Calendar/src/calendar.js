Vue.component('meeting_visual_data', {
    template: '<h5>{{ item }}<button v-on:click = "deletemeeting(item)">Delete</button></h5><br/>',
    data: function() {
        return {
            counter: 0
        }
    },
    props: ['item'],
    methods: {
        delete_button: function(mt) {
            this.$emit('deletemeeting', mt);
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