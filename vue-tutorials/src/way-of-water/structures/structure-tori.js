import StructureBase from './structure-base'

export default class StructureTori extends StructureBase {
    structureName = "Tori"
    
    structureActions = [
        (data) => this.useCleanWater(data),
        (data) => this.useDirtyWater(data)
    ]

    getOuputDataFromStructure(inputData) {
        inputData = super.getOutputDataFromStructure(inputData)

        return this.turnActions[inputData.currentTurn](inputData)
    }

    useCleanWater(inputData) {
        if (inputData.cleanWater > 0) {

            inputData.cleanWater--
            inputData.dirtyWater++

            inputData.thisTurnActions.push(`${this.structureName} freed clean water.`)
            
            if (inputData.food >= 3) {
                inputData.food -= 3
                inputData.diamond++
                inputData.thisTurnActions.push(`${this.structureActions} created a diamond.`)
            }
        }
        else {
            inputData.thisTurnActions.push(`${this.structureName} did nothing.`)
        }

        return inputData
    }

    useDirtyWater(inputData) {
        if (inputData.dirtyWater > 0) {
            
            inputData.dirtyWater--
            inputData.thisTurnActions.push(`${this.structureName} used a dirty water.`)
        }
        else {
            inputData.thisTurnActions.push(`${this.structureName} did nothing.`)
        }

        return inputData
    }
}