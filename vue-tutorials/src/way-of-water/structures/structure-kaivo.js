import StructureBase from './structure-base.vue'

export default class StructureKaivo extends StructureBase {
    
    turnActions = []
    structureActions = [
                storeCleanWater,
                storeDirtyWater,
                storeDiamond
            ]

    getOutputFromStructure(inputData) {
        // First try to get value out from the structure, if possible
        if (this.storedData.cleanWater > 0) {
            inputData.cleanWater++
        }
        else if (this.storedData.dirtyWater > 0) {
            inputData.dirtyWater++
        }
        else if (this.storedData.diamond > 0) {
            inputData.diamond++;
        }
        else {
            // Do predetermined action
            return this.turnActions[inputData.currentTurn](inputData)
        }

        return inputData
    }

    storeCleanWater(inputData) {
        if (inputData.cleanWater > 0) {
            inputData.cleanWater--
            this.storedData.cleanWater++
        }

        return inputData
    }
    
    storeDirtyWater(inputData) {
        if (inputData.dirtyWater > 0) {
            inputData.dirtyWater--
            this.storedData.dirtyWater++
        }

        return inputData
    }
    
    storeDiamond(inputData) {
        if (inputData.diamond > 0) {
            inputData.diamond--
            this.storedData.diamond++
        }
    }
}