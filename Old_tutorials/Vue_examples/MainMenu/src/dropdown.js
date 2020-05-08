Vue.component('dropdownmenuitem', {
    template: '<h5><button v-on:click = "openpage(menuitem.link)">{{menuitem.name}}</button></h5>',
    props: ['menuitem'],
    methods: {
        openpage: function(linktoopen) {
            this.$emit('openpage', linktoopen);
        },
    }
})

var vmdropdown = new Vue({
    el: "#dropdown",
    data: {
        showdropdown: false,
        menuelements: [
            { 
                name: 'Calendar',
                link: '../../Calendar/html/calendar.html'
            },
            {
                name: 'Exercise_2',
                link: 'index.html'

            },
            { 
                name: 'Info',
                link: 'index.html'
            },
        ]
    },
    methods: {
        togglemenu: function() {
            this.showdropdown = !this.showdropdown;
            console.log("Menu toggled.");
        },
        openlink: function(linktoopen) {
            window.location.href = linktoopen;
        }
    }
});