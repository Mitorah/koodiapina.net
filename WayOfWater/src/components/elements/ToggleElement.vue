<template>
    <div>
        <table>
        <tr>
        <th><input type="checkbox"></th>
        <th><h5>{{ title }}</h5></th>
        </tr>
    </table>
    </div>
</template>

<script>
export default {
    props: {
        title: String, 
        selected: Boolean,
    },
}
</script>