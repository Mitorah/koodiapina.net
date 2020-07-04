<template>
    <v-app>
        <v-card max-width="420">
            <v-card-text>
                <sync-child-boolean v-model="childBoolean">
                </sync-child-boolean>
            Boolean in parent: {{ childBoolean }}
            </v-card-text>
        </v-card>
        <v-card max-width="420">
            <v-card-text>
                <sync-child-string v-model="childString">
                </sync-child-string>
                String in parent: {{ childString }}  
            </v-card-text>
        </v-card>
    </v-app>
</template>

<script>
import syncchildVue from './syncchildboolean.vue'
import syncchildstringVue from './syncchildstring.vue'
export default {
    components: {
        'sync-child-boolean': syncchildVue,
        'sync-child-string': syncchildstringVue,
    },
    data() {
        return {
            childBoolean: true,
            childString: "New string"
        }
    }

}
</script>

<style>

</style>