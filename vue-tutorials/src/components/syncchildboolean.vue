<template>
    <div>
        Boolean in child: {{ checked }}
        <br/>
        <input
        type="checkbox"
        v-bind:checked="checked"
        @change="$emit('change', $event.target.checked)"
        value="checked"
        >
    </div>
</template>

<script>
export default {
    model: {
        prop: 'checked',
        event: 'change'
    },
    props: {
        checked: Boolean,
    },
    data() {
        return {

        }
    }
}
</script>

<style>

</style>