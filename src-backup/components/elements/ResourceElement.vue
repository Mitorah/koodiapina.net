<template>
    <div class="input-field-column">
        Resource
        <br>
        <input type="text" v-bind:value = title>
        <input type="number">
        <br>
        User decides: 
        <input type="checkbox">
    </div>
</template>


<script>
export default {
    props: {
        title: String,
    },
    data() {
        return {
            
        }
    }
}
</script>