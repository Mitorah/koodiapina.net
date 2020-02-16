Vue.Component('meeting_visual_data', {
    template: '<h5>{{ item }}</h5><br/>',
    data: function() {
        return {
            counter: 0
        }
    },
    props: ['item'],
    methods: {
        display_meeting: function(mt) {
            this.$emit('showmeeting', mt);
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
   },

});