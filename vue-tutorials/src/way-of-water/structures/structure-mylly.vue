<script>
import StructureBase from './structure-base.vue'

export default class StructureMylly extends StructureBase {
    getOutputDataFromStucture(inputData) {
        if (inputData.cleanWater >= 1) {
            inputData.cleanWater--

            if (inputData.food >= 2) {
                inputData.food -= 2

                var createdFood = 3 - inputData.dirtyWater < 0 ? 0 : 3 - inputData.dirtyWater

                inputData.food += createdFood
            }
        }

        return inputData
    }
}
</script>

<style>

</style>