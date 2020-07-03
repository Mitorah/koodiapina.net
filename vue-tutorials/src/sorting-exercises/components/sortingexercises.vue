<template>
    <v-app>
        <v-col>
            <v-card>
                <v-card-title>
                    This will contain sorting exercises.
                </v-card-title>
                <v-row>
                    <compare-and-sort></compare-and-sort>
                </v-row>
            </v-card>
        </v-col>
    </v-app>
</template>

<script>
import compareandsortVue from './compareandsort.vue'
export default {
    components: {
        'compare-and-sort': compareandsortVue
    },
    data() {
        return {
        }
    }

}
</script>

<style>

</style>