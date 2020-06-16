<template>
    <div>
        Not functional
        <v-select v-model="selected">
            <v-option v-for='(item, index) in arrayOfItems'
            :key='item.value'
            :index='index'>
            <nav-bar-item :navBarItem="item"></nav-bar-item>
            </v-option>
        </v-select>
    </div>
</template>

<script>
import navbaritemVue from './navbaritem.vue'
export default {
    props: {
        item: Object
    },
    components: {
        'nav-bar-item': navbaritemVue,
    },
    data() {
        return {
            selected: "null",
            arrayOfItems: [
                { 
                    textlabel: "laabel", 
                    destination: "http.//www.google.com"
                },
                {
                    textlabel: "second item",
                    destination: "second link"
                },
                {
                    textlabel: "third",
                    destination: "third place"
                },
            ]
        }
    }
}
</script>

<style>

</style>