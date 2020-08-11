<template>
    <v-app>
        <v-container>
            <v-row
            no-gutters
            style="height:150px;">
                <v-col
                cols="auto">
                <synchronize-to-cloud @databaseUpdate="setDatabase" :structureDatabase="firstPersonArray"></synchronize-to-cloud>
                <v-spacer></v-spacer>
                <v-btn @click="runDataCollect">Run Data</v-btn>
                <v-spacer></v-spacer>
                {{ result }}
                </v-col>
            </v-row>
            <v-row
            no-gutters
            style="height:150px">
                <v-col
                align="start">
                    <vue-nestable 
                    v-model="firstPersonArray"
                    cross-list
                    group="structureactions">
                        <vue-nestable-handle
                        slot-scope = "{ item }"
                        :item="item">
                        {{ item.name}}
                        </vue-nestable-handle>
                    </vue-nestable>
                </v-col>
                <v-col
                align="end">
                    <vue-nestable 
                    v-model="secondPersonArray"
                    cross-list
                    group="structureactions">
                        <vue-nestable-handle
                        slot-scope = "{ item }"
                        :item="item">
                        {{ item.name }}
                        </vue-nestable-handle>
                    </vue-nestable>
                </v-col>
            </v-row>
        </v-container>
    </v-app>
</template>

<script type="text/babel">
import {VueNestable, VueNestableHandle } from 'vue-nestable'
// import FunctionOne from './items/function_1'
// import FunctionTwo from './items/function_2'
import synchronisetocloudVue from './synchronisetocloud.vue'

export default {
    components: {
        VueNestable,
        VueNestableHandle,
        'synchronize-to-cloud': synchronisetocloudVue
    },
    data() {
        return {
            result: "This is the result of the functions combined.",
            data: {
                description: ""
            },

            functionArray: [],
            firstPersonArray: [
                {id:0, name:"First name"},
                {id:1, name:"Second name"},
                {id:2, name:"Third name"},
                {id:3, name:"Fourth name"},
                {id:4, name:"Fifth name"},
                {id:5, name:"Sixth name"},
            ],
            secondPersonArray: [
                {id:4, name:"First name 2"},
                {id:5, name:"Second name 2"},
                {id:6, name:"Third name 2"},
                {id:7, name:"Fourth name 2"},
            ]
        }
    },
    methods: {
        runDataCollect() {
        this.data.description = ""
        this.firstPersonArray.forEach(element => {
            this.data = element.data.returningFunction(this.data)
        })
        
        this.result = this.data.description

        console.log(this.firstPersonArray)
        },
        setDatabase(value) {
            this.firstPersonArray = value
        }
    }
}
</script>

<style>
/*
* Style for nestable straight from the example
*/
.nestable {
  position: relative;
}
.nestable-rtl {
  direction: rtl;
}
.nestable .nestable-list {
  margin: 0;
  padding: 0 0 0 40px;
  list-style-type: none;
}
.nestable-rtl .nestable-list {
  padding: 0 40px 0 0;
}
.nestable > .nestable-list {
  padding: 0;
}
.nestable-item,
.nestable-item-copy {
  margin: 10px 0 0;
}
.nestable-item:first-child,
.nestable-item-copy:first-child {
  margin-top: 0;
}
.nestable-item .nestable-list,
.nestable-item-copy .nestable-list {
  margin-top: 10px;
}
.nestable-item {
  position: relative;
}
.nestable-item.is-dragging .nestable-list {
  pointer-events: none;
}
.nestable-item.is-dragging * {
  opacity: 0;
  filter: alpha(opacity=0);
}
.nestable-item.is-dragging:before {
  content: ' ';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(106, 127, 233, 0.274);
  border: 1px dashed rgb(73, 100, 241);
  -webkit-border-radius: 5px;
  border-radius: 5px;
}
.nestable-drag-layer {
  position: fixed;
  top: 0;
  left: 0;
  z-index: 100;
  pointer-events: none;
}
.nestable-rtl .nestable-drag-layer {
  left: auto;
  right: 0;
}
.nestable-drag-layer > .nestable-list {
  position: absolute;
  top: 0;
  left: 0;
  padding: 0;
  background-color: rgba(106, 127, 233, 0.274);
}
.nestable-rtl .nestable-drag-layer > .nestable-list {
  padding: 0;
}
.nestable [draggable="true"] {
  cursor: move;
}
.nestable-handle {
  display: inline;
}
</style>