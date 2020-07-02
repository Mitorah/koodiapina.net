<template>
    <v-app>
        <v-col sm="4">
            <v-row align="left">
            <v-col v-for = 'item in arrayForCheckbox'
            :key='item.id'
            height=32 >
                <v-card
                outlined>
                    <v-list-item one-line width="400">
                        <v-card-actions>
                            <v-checkbox :id=item.id :value=item v-model=checked></v-checkbox>
                            <v-list-item-title v-text="item.id + ' - ' + item.value"></v-list-item-title>
                        </v-card-actions>
                    </v-list-item>
                </v-card>
                </v-col>
            </v-row>
        </v-col>
            <v-title>Checked</v-title>
            
            <v-row>
                <v-col v-for = "(item, index) in checked"
                :key="item.id"
                :index="index"
                cols="32"
                sm="1">
                    <v-card width="200">
                        <v-list-item-title v-text="item.id" ></v-list-item-title>
                        <v-list-item-subcontent v-text="item.value"></v-list-item-subcontent>
                    </v-card>
                </v-col>
            </v-row>
    </v-app>
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
                { id: "sixthID", value:"SkördiFördi" },
            ],
            checked : [],
        }
    },
    computed: {
        combinedValue(arrayIndex) {
            return this.arrayForCheckbox[arrayIndex].id + ", " + this.arrayForCheckbox[arrayIndex].value
        }
    }
}
</script>

<style>

</style>