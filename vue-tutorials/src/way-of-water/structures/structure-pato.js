import StructureBase from './structure-base.vue'

export default class StructurePato extends StructureBase {
    slots = 2
    structureActions = [
        dontStoreWater,
        storeOneWater,
        storeTwoWater
    ]

    getOutputDataFromStructure(inputData) {
        return turnActions(inputData.currentTurn)
    }

    tryToStoreWater(inputData, cleanWaterToStore, dirtyWaterToStore) {
        
        if (this.storedData.cleanWater + this.storedData.dirtyWater >= this.slots) {
            // Full
        }
        else {
            if (this.storedData.cleanWater < cleanWaterToStore) {
                if (inputData.cleanWater > 0) {
                    inputData.cleanWater--
                    this.storeData.cleanWater++
                    return this.tryToStoreWater(inputData, cleanWaterToStore, dirtyWaterToStore)
                }
            }

            if (this.storedData.dirtyWater < dirtyWaterToStore) {
                if (inputData.dirtyWater > 0) {
                    inputData.dirtyWater--
                    this.storeData.dirtyWater++
                    return this.tryToStoreWater(inputData, cleanWaterToStore, dirtyWaterToStore)
                }
            }
        }

        return this.tryToReleaseWater(inputData, cleanWaterToStore, dirtyWaterToStore)
    }
    
    tryToReleaseWater(inputData, cleanWaterToStore, dirtyWaterToStore) {
        
        if (this.storedData.cleanWater > cleanWaterToStore) {
            inputData.cleanWater += this.storedData.cleanWater - cleanWaterToStore
            this.storedDa.cleanWater = cleanWaterToStore
        }

        if (this.storedData.dirtyWater > dirtyWaterToStore) {
            inputData.dirtyWater += this.storedData.dirtyWater - dirtyWaterToStore
            this.storedData.dirtyWater = dirtyWaterToStore
        }

        return inputData
    }

    dontStoreWater(inputData) {
        return this.tryToStoreWater(inputData, 0, 0)
    }

    storeOneCleanWater(inputData) {
        return this.tryToStoreWater(inputData, 1, 0)
    }

    storeTwoCleanWaters(inputData) {
        return this.tryToStoreWater(inputData, 2, 0)
    }

    storeOneDirtyWater(inputData) {
        return this.tryToStoreWater(inputData, 0, 1)
    }

    storeTwoDirtyWaters(inputData) {
        return this.tryToStoreWater(inputData, 0, 2)
    }
    
    storeCleanAndDirtyWater(inputData) {
        return this.tryToStoreWater(inputData, 1, 1)
    }
}