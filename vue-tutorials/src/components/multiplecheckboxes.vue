<template>
    <div>
        <ol>
            <li v-for = 'item in arrayForCheckbox'
            :key='item.id'>
            <input type="checkbox" :id=item.id :value=item v-model=checked>
            {{ item.id }}
            </li>
        </ol>

        <!-- ToDo: remove numbers -->
        <span>Checked: </span><br/>
        <ol>
            <li v-for = "item in checked"
            :key="item.id">
            {{item.id + " -> " + item.value}}
            </li>
        </ol>
    </div>
</template>

<script>
export default {
    data() {
        return {
            arrayForCheckbox: [
                { id: "firstID", value:"FirstValue" },
                { id: "secondID", value:"SecondValue" },
                { id: "thirdID", value:"HurrDurr" },
                { id: "fourthID", value:"HerpDerp" },
                { id: "fifthID", value:"HirryHarry" },
            ],
            checked : [],
        }
    },
}
</script>

<style>

</style>