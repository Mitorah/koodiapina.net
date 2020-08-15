<template>
        <v-card 
        class="mx-auto"
        min-height="30"
        max-height="100" 
        min-width="50"
        max-width="400">
            <v-list-item>
                <v-list-item-content>
                    <v-list-item-title v-text="this.landname"></v-list-item-title>
                    <v-list-item-subtitle v-text="this.landcounter"></v-list-item-subtitle>
                </v-list-item-content>

                <v-spacer></v-spacer>
                

                <v-list-item-action>
                    <v-btn @click="removelands()" icon><v-icon>mdi-minus</v-icon> </v-btn>
                </v-list-item-action>
                
                <v-list-item-action>
                    <v-btn @click="addlands()" icon><v-icon>mdi-plus</v-icon></v-btn>
                </v-list-item-action>
            </v-list-item>
        </v-card>
</template>

<script>
export default {
    props: {
        landname: String,
        landid: String,
    },
    data() {
        return {
            landcounter: 0
        }
    },
    methods: {
        addlands() {
            this.landcounter++
            this.$emit('addlands', this.landid)
        },
        removelands() {
            if (this.landcounter > 0) {
                this.landcounter--
                this.$emit('removelands', this.landid)
            }
        }
    }

}
</script>

<style>

</style>