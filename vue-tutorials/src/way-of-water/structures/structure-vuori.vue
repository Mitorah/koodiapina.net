<script>
import StructureBase from './structure-base.vue'

export default class StructureVuori extends StructureBase {
    getOutputDataFromStructure(inputData) {
        inputData.food = 0
        inputData.diamond = 0
        inputData.cleanWater = 4 + Math.ceil(inputData.cleanWater / 2)
        inputData.dirtyWater = inputData.cleanWater >= 6 ? 1 : 0

        return inputData
    }
}
</script>

<style>

</style>