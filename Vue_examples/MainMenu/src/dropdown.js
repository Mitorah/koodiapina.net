const Dropdown = Vue.component('dropdownmenu', {
    template: '<button v-on:click = "toggleshow"> {{menuitem.name}} </button>',
    props: ['menuitem'],
    methods: {
        toggleshow: function() {
            this.$emit('togglemenu');
        }
    }
});

var vmdropdown = new Vue({
    el: "#dropdown",
    component: {
        Dropdown,
    },
    data: {
        showdropdown: false,
        menuelements: [
            { 
                name: 'Calendar'
            },
            {
                name: 'Exercise_2'
            },
            { 
                name: 'Info' 
            }
        ]
    },
    methods: {
        togglemenu: function() {
            this.showdropdown = !this.showdropdown;
        }
    }
});