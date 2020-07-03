<template>
    <v-app>
        <v-card>
            <v-card-title>
                This will contain sorting exercises.
            </v-card-title>
            <unsorted-array></unsorted-array>
        </v-card>
    </v-app>
</template>

<script>
import unsortedarrayVue from './unsortedarray.vue'
export default {
    components: {
        'unsorted-array': unsortedarrayVue
    },
    data() {
        return {

        }
    }

}
</script>

<style>

</style>