import StructureBase from './structure-base'

export default class StructurePato extends StructureBase {
    structureName = "Pato"
    slots = 2
    structureActions = [
        (data) => this.dontStoreWater(data),
        (data) => this.storeOneCleanWater(data),
        (data) => this.storeTwoCleanWaters(data),
        (data) => this.storeOneDirtyWater(data),
        (data) => this.storeTwoDirtyWaters(data),
        (data) => this.storeCleanAndDirtyWater(data)
    ]
    structureActionHappened = false

    getOutputDataFromStructure(inputData) {
        inputData = super.getOutputDataFromStructure(inputData)
        
        return this.turnActions[inputData.currentTurn](inputData)
    }

    tryToStoreWater(inputData, cleanWaterToStore, dirtyWaterToStore) {
        
        if (this.storedData.cleanWater + this.storedData.dirtyWater >= this.slots) {
            inputData.thisTurnActions.push(`${this.structureName} is full (${this.storedData.cleanWater}/${this.storedData.dirtyWater} (clean/dirty)).`)
        }
        else {
            if (this.storedData.cleanWater < cleanWaterToStore) {
                if (inputData.cleanWater > 0) {
                    this.structureActionHappened = true
                    inputData.cleanWater--
                    this.storedData.cleanWater++
                    inputData.thisTurnActions.push(`${this.structureName} stored clean water.`)
                    return this.tryToStoreWater(inputData, cleanWaterToStore, dirtyWaterToStore)
                }
            }

            if (this.storedData.dirtyWater < dirtyWaterToStore) {
                if (inputData.dirtyWater > 0) {
                    this.structureActionHappened = true
                    inputData.dirtyWater--
                    this.storedData.dirtyWater++
                    inputData.thisTurnActions.push(`${this.structureName} stored dirty water.`)
                    return this.tryToStoreWater(inputData, cleanWaterToStore, dirtyWaterToStore)
                }
            }
        }

        return this.tryToReleaseWater(inputData, cleanWaterToStore, dirtyWaterToStore)
    }
    
    tryToReleaseWater(inputData, cleanWaterToStore, dirtyWaterToStore) {
        var waterToBeReleased = 0
        
        if (this.storedData.cleanWater > cleanWaterToStore) {
            waterToBeReleased = this.storedData.cleanWater - cleanWaterToStore
            inputData.cleanWater += waterToBeReleased
            this.storedData.cleanWater = cleanWaterToStore
            inputData.thisTurnActions.push(`${this.structureName} released ${ waterToBeReleased } clean water.`)
            this.structureActionHappened = true
        }

        if (this.storedData.dirtyWater > dirtyWaterToStore) {
            waterToBeReleased = this.storedData.dirtyWater - dirtyWaterToStore
            inputData.dirtyWater += waterToBeReleased
            this.storedData.dirtyWater = dirtyWaterToStore
            inputData.thisTurnActions.push(`${this.structureName} released ${ waterToBeReleased } dirty water.`)
            this.structureActionHappened = true
        }

        if (!this.structureActionHappened) {
            inputData.thisTurnActions.push(`${this.structureName} did nothing.`)
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