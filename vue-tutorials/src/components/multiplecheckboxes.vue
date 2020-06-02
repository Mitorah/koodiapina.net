<template>
    <div>
        <ol>
            <li v-for = 'item in idObjects'
            :key='item'>
            <input type="checkbox" :id=item.id :value=item v-model=checked>
            {{ item.id }}
            </li>
        </ol>

        <!-- ToDo: remove numbers -->
        <span>Checked: </span><br/>
        <ol>
            <li v-for = "item in checked"
            :key="item">
            {{item.id + " -> " + item.value}}
            </li>
        </ol>
    </div>
</template>

<script>
export default {
    props: {
        idObjects : Array
    },
    data() {
        return {
            checked : [],
        }
    },
}
</script>

<style>

</style>