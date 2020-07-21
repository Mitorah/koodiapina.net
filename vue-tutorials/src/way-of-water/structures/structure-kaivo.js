import StructureBase from './structure-base'

export default class StructureKaivo extends StructureBase {
    structureName = "Kaivo"
    turnActions = []
    structureActions = [
                (data) => this.storeCleanWater(data),
                (data) => this.storeDirtyWater(data),
                (data) => this.storeDiamond(data)
            ]

    getOutputDataFromStructure(inputData) {
        // First try to get value out from the structure, if possible
        if (this.storedData.cleanWater > 0) {
            inputData.thisTurnActions.push(`Got clean water from ${this.structureName}.`)
            inputData.cleanWater++
            this.storedData.cleanWater--
        }
        else if (this.storedData.dirtyWater > 0) {
            inputData.thisTurnActions.push(`Got dirty water from ${this.structureName}.`)
            inputData.dirtyWater++
            this.storedData.dirtyWater--
        }
        else if (this.storedData.diamond > 0) {
            inputData.thisTurnActions.push(`Got diamond from ${this.structureName}.`)
            inputData.diamond++;
            this.storedData.dirtyWater--
        }
        else {
            // Do predetermined action
            if (typeof this.turnActions[inputData.currentTurn] === "function") {
                inputData = this.turnActions[inputData.currentTurn](inputData)
            }
            else {inputData
                console.error(`${this.turnActions[inputData.currentTurn]} was not a function.`)
            }
            
            return inputData
        }

        return inputData
    }

    storeCleanWater(inputData) {
        if (inputData.cleanWater > 0) {
            inputData.cleanWater--
            this.storedData.cleanWater++
            inputData.thisTurnActions.push(`Stored clean water to ${this.structureName}.`)
        }
        else {
            inputData.thisTurnActions.push(`No actions for ${this.structureName}.`)
        }

        return inputData
    }
    
    storeDirtyWater(inputData) {
        if (inputData.dirtyWater > 0) {
            inputData.dirtyWater--
            this.storedData.dirtyWater++
            inputData.thisTurnActions.push(`Stored dirty water to ${this.structureName}.`)
        }
        else {
            inputData.thisTurnActions.push(`No actions for ${this.structureName}.`)
        }

        return inputData
    }
    
    storeDiamond(inputData) {
        if (inputData.diamond > 0) {
            inputData.diamond--
            this.storedData.diamond++
            inputData.thisTurnActions.push(`Stored diamond to ${this.structureName}.`)
        }
        
        inputData.thisTurnActions.push(`No actions for ${this.structureName}.`)
 
        return inputData
    }
}