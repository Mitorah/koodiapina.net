import StructureBase from './structure-base.vue'

export default class StructureMetsastaja extends StructureBase {
    getOutputFromStructure(inputData) {
        if (storedData.cleanWater == 0 && inputData.cleanWater > 0) {
            storedData.cleanWater++
            inputData.cleanWater--
        }
        else if (storedData.cleanWater > 0) {
            storedData.cleanWater--
            inputData.food++
        }

        return inputData
    }
}