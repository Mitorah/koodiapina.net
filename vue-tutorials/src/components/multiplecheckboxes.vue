<template>
    <div>

        <v-col sm="4">
        <ol>
            <v-list height=32 v-for = 'item in arrayForCheckbox'
            :key='item.id'>
                    <v-row align="center">
                        <v-checkbox :id=item.id :value=item v-model=checked></v-checkbox>
                        <v-text-field readonly v-model="item.id"></v-text-field>
                        <v-text-field readonly v-model="item.value"></v-text-field>
                    </v-row>
            </v-list>
        </ol>
        </v-col>
        <v-col sm="4">
        <!-- ToDo: remove numbers -->
        <br/><span>Checked: </span><br/>
        <ol>
            <v-list min-width=50 max-width=600 height=42 v-for = "item in checked"
            :key="item.id">
            <v-row>
                <v-text-field readonly label="ID" v-model="item.id"></v-text-field>
                <v-text-field readonly label="Value" v-model="item.value"></v-text-field>
            </v-row>
            </v-list>
        </ol>
        </v-col>
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