<script>
import StructureBase from './structure-base.vue'

export default class StructureTori extends StructureBase {
    structureActions = [
        useCleanWater,
        useDirtyWater
    ]

    getOuputDataFromStructure(inputData) {
        return structureActions[inputData.currentTurn](inputData)
    }

    useCleanWater(inputData) {
        if (inputData.cleanWater > 0) {
            inputData.cleanWater--
            
            if (inputData.food >= 3) {
                inputData.food -= 3
                inputData.diamond++
            }
        }

        return inputData
    }

    useDirtyWater(inputData) {
        if (inputData.dirtyWater > 0) {
            inputData.dirtyWater--
        }

        return inputData
    }
}
</script>

<style>

</style>