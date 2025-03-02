<template>
    <el-container class="bordered">
        <el-header>
            {{ title }}
        </el-header>
        <el-main>
            <el-row>
                <el-col>
                    <el-card v-for="i in 10" :key=i>
                        <h1>{{ message }}</h1>
                    </el-card>
                </el-col>
            </el-row>
        </el-main>
    </el-container>
</template>

<script>
import { loremipsum } from '../utils/loremipsum';

export default {
    name: 'AIWindow',
    data() {
        return {
        };
    },
    mounted() {
        console.log('AI Window mounted');
    },
    computed: {
        title() {
            return 'AI Window';
        },
        message() {
            return loremipsum();
        }
    }
};
</script>

<style scoped>

</style>