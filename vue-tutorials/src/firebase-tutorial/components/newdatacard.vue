<template>
    <v-form
    ref="form"
    v-model="valid"
    >
        <v-container>
            <v-row>
                <v-col cols="auto">
                    <v-text-field 
                    v-model="inputData.name" 
                    :counter="0"
                    :rules="nameRules"
                    label="Name"
                    required></v-text-field>
                </v-col>
                <v-col cols="auto">
                    <v-text-field 
                    v-model="inputData.description" 
                    :counter="0"
                    :rules="descriptionRules"
                    label="Description"
                    required></v-text-field>
                </v-col>
                <v-col cols="auto">
                    <v-btn 
                    :disabled="!valid" 
                    @click="$emit('data-submitted', inputData); inputData.name = ''; inputData.description = ''"
                    >Add new item</v-btn>
                </v-col>
            </v-row>
        </v-container>
    </v-form>
</template>

<script>
export default {
    data() {
        return {
            valid: true,
            cardNav: true,
            inputData: {
                name: "",
                description: ""
            },
            nameRules: [
                v => !!v || 'Required.',
                v => (v && v.length > 3) || 'Too short name'
            ],
            descriptionRules: [
                v => !!v || 'Required',
                v => (v && v.length > 5) || 'Too short description'
            ]
        }
    },
}
</script>

<style>

</style>