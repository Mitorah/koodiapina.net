<template>
    <v-app>
        <v-col sm="2">
            <v-text-field label="Add new item:" v-model="inputMessage" @change="addNewMessage(inputMessage)">
            </v-text-field>
        </v-col>

        <v-row>
            <v-col v-for = '(item, index) in dataArray'
            :key = 'item.value'
            cols="32"
            sm="3">
                <v-card width="800">
                    <v-list-item>
                        <v-list-item-content>
                            <v-list-item-title>
                                <reverse-string-computed :message=item.text :reversed=item.reversed></reverse-string-computed>
                            </v-list-item-title>
                            <v-card-actions>
                                <v-btn text @click="deleteMessage(index)">Delete</v-btn>
                                <v-btn text v-if="item.reversed" @click="toggleReverse(index)">Correct</v-btn>
                                <v-btn text v-else @click="toggleReverse(index)">Reverse</v-btn>                        
                            </v-card-actions>
                        </v-list-item-content>
                    </v-list-item>
                </v-card>
            </v-col>
        </v-row>
    </v-app>
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