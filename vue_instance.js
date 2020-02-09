var vm = new Vue({
    el: "#vue_det",
    data: {
        first_name: "John",
        last_name: "Doe",
        htmlcontent: "<div><h1>Vue Js Template</h1></div>",
        visible_img: "",
        imgsrc_1: "images/bowling_beer.jpg",
        imgsrc_2: "images/hots_alarak.jpg"
    },

    methods: {
        information : function() {
            return "My name is " + this.first_name + " " + this.last_name + ".";
        },
        changetoimg_1: function() {
            this.visible_img = this.imgsrc_1;
        },
        changetoimg_2: function() {
            this.visible_img = this.imgsrc_2;
        }
    }
})