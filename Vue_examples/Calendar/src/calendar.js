Vue.component('meeting_visual_data', {
    template: '<h5>{{ item }}<button v-on:click = "delete_button(item)">Delete</button></h5><br/>',
    /*data: function() {
        return {
            counter: 0
        }
    },*/
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
       new_meeting: "",
       meetings: ['one', 'two','three','four'],
   },
   methods: {
       addmeeting: function() {
           if (this.new_meeting != "") {
               this.meetings.push(this.new_meeting)
           }

           this.new_meeting = ""
       },
       deletemeeting: function(deletedmeeting) {
           this.meetings.splice(this.meetings.indexOf(deletedmeeting), 1);
       }
   },

});