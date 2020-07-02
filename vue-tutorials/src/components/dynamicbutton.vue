<template>
<v-col dense sm="1">
        <v-btn @[dynamicAttribute]="buttonfunction">{{ dynamicAttribute }}</v-btn>
        <v-text-field readonly v-model="message"></v-text-field>
</v-col>
</template>

<script>
export default {
    props: {
        'dynamicAttribute': String
    },
    data() {
        return {
            message: ""
        }
    },
    methods: {
        buttonfunction() {
            this.message = this.dynamicAttribute + "!"
        }
    }

}
</script>

<style>

</style>