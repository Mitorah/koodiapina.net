<template>
        <v-card 
        class="mx-auto"
        max-height="200" 
        min-width="200"
        max-width="200">
            <v-list-item three-line>
                <v-list-item-content>
                    <div class="overline mb-4" align="center">
                    {{`${this.landname}`}}
                    </div>
                <v-list-item-subtitle class="headline mb-1" align="center">
                    {{`${this.landcounter}`}}
                </v-list-item-subtitle>
                </v-list-item-content>
            </v-list-item>

            <v-card-actions align="right">
                <v-btn @click="$emit('addlands', landid); landcounter++" icon><v-icon>mdi-plus</v-icon></v-btn>
                <v-btn @click="$emit('removelands', landid); landcounter--" icon><v-icon>mdi-minus</v-icon> </v-btn>
            </v-card-actions>
        </v-card>
</template>

<script>
export default {
    props: {
        landname: String,
        landid: String
    },
    data() {
        return {
            landcounter: 0
        }
    }

}
</script>

<style>

</style>