<template>
    <div>
        <v-btn @[dynamicAttribute]="buttonfunction">{{ dynamicAttribute }}</v-btn>
        <span> {{ message }}</span>
    </div>
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