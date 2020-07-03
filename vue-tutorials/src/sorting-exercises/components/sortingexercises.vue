<template>
    <v-app>
        <v-col>
            <v-card>
                <v-card-title>
                    This will contain sorting exercises.
                </v-card-title>
                <v-row>
                    <bubble-sort></bubble-sort>
                </v-row>
                <v-row>
                    <heap-sort></heap-sort>
                </v-row>
            </v-card>
        </v-col>
    </v-app>
</template>

<script>
import compareandsortVue from './bubblesort.vue'
import heapsortVue from './heapsort.vue'
export default {
    components: {
        'bubble-sort': compareandsortVue,
        'heap-sort': heapsortVue
    },
    data() {
        return {
        }
    }

}
</script>

<style>

</style>