<template>
    <div>
        <ol>
            <li v-for = '(item, index) in dataArray'
            :key = 'item.value'>
            <reverse-string-computed :message=item.text :reversed=item.reversed></reverse-string-computed>
            <button @click="deleteMessage(index)">Delete</button>
            <button v-if="item.reversed" @click="toggleReverse(index)">Correct</button>
            <button v-else @click="toggleReverse(index)">Reverse</button>
            <br/>
            </li>
        </ol>
        <br/>
        <br/>
        <span>Add new item: </span>
        <input v-model="inputMessage" @change="addNewMessage(inputMessage)">

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