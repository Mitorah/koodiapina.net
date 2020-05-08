Vue.component('meeting_visual_data', {
    template: '<h5>{{' + 
    'item.name }}: {{item.start_time}} - {{item.end_time}}, {{item.date}}' +
    ' <button v-on:click = "delete_button(item)">Delete</button></h5><br/>',
    props: ['item'],
    methods: {
        delete_button: function(mt) {
            this.$emit('delete_button', mt);
        }
    },
});