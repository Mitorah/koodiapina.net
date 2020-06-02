<template>
    <div>
        <a :href="link"> {{ label }} ({{link}})</a>
    </div>
</template>

<script>
export default {
    props: {
        navBarItem: Object
    },
    computed: {
        label() {
            return this.navBarItem.textlabel;
        },
        link() {
            return this.navBarItem.destination;
        }
    }
}
</script>

<style>

</style>