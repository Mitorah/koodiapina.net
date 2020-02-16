Vue.Component('meeting_visual_data', {
    template: '',
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