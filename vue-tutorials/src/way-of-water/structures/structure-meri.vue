<script>
import StructureBase from './structure-base.vue'

export default class StructureMeri  extends StructureBase {
    
    getOutputDataFromStructure(inputData) {
        this.storedData.dirtyWater += inputData.dirtyWater

        this.checkLosingConditions()

        return inputData
    }
    
    checkLosingConditions() {
        if (this.storedData.dirtyWater >= 6) {
            // Lost the game
        }
    }
}
</script>

<style>

</style>