<template>
    <div>
        <v-col sm="2">
        <v-text-field label="Add new item:" v-model="inputMessage" @change="addNewMessage(inputMessage)">
        </v-text-field>
        </v-col>
        
        <ol>
            <li v-for = '(item, index) in dataArray'
            :key = 'item.value'>
            <reverse-string-computed :message=item.text :reversed=item.reversed></reverse-string-computed>
            <v-btn @click="deleteMessage(index)">Delete</v-btn>
            <v-btn v-if="item.reversed" @click="toggleReverse(index)">Correct</v-btn>
            <v-btn v-else @click="toggleReverse(index)">Reverse</v-btn>
            <br/>
            </li>
        </ol>
        <br/>
    </div>
</template>

<script>
import reversestringcomputedVue from './reversestringcomputed.vue';
export default {
    components: {
        'reverse-string-computed': reversestringcomputedVue    
    },
    data() {
        return {
            inputMessage: "",
            dataArray: [
            ],
            
        }
    },
    methods: {
        addNewMessage(input) {
            this.dataArray.push({
                text: input,
                reversed: false
            });

            this.inputMessage = ""
        },
        deleteMessage(fromIndex) {
            this.dataArray.splice(fromIndex, 1);
        },
        toggleReverse(index) {
            this.dataArray[index].reversed = !this.dataArray[index].reversed;
        }
    }
}
</script>

<style>

</style>