<template>
    <v-card
    class="mx-auto"
    min-width="340"
    max-width="340">
    <v-toolbar>
            <v-btn icon @click="showItem = !showItem">
            <v-icon>{{ showItem ? 'mdi-chevron-up' : 'mdi-chevron-down' }}</v-icon>
            </v-btn>
        <v-spacer></v-spacer>
            {{ itemdata.name }}
        <v-spacer></v-spacer>
            <v-btn icon @click="$emit('remove-item', itemdata.key)">
                <v-icon>{{'mdi-close'}}</v-icon>
            </v-btn>
    </v-toolbar>
        <v-expand-transition>
            <div v-show="showItem">
                <v-divider></v-divider>
                <v-card-text>
                    {{ itemdata.description }}
                </v-card-text>
                <v-divider></v-divider>
            </div>
        </v-expand-transition>
    </v-card>
</template>

<script>
export default {
    props: {
        itemdata: Object
    },
    data() {
        return {
            showItem: false,
        }
    }
}
</script>

<style>

</style>