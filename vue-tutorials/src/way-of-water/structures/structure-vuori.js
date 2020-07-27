import StructureBase from './structure-base'

export default class StructureVuori extends StructureBase {
    structureName = "Vuori"
    
    getOutputDataFromStructure(inputData) {
        
        inputData.currentTurn++
        inputData.food = 0
        inputData.diamond = 0
        inputData.thisTurnActions = []
        inputData.thisTurnStructures = []
        
        inputData = super.getOutputDataFromStructure(inputData)
        
        var cleanWaterToBeAdded = Math.ceil(inputData.cleanWater / 2) + 4

        inputData.thisTurnActions.push(`${this.structureName} created ${cleanWaterToBeAdded} clean water.`)

        inputData.cleanWater += cleanWaterToBeAdded
        
        if (inputData.cleanWater >= 6) {
            inputData.dirtyWater++
            inputData.thisTurnActions.push(`${this.structureName} created one dirty water,`)
        }

        return inputData
    }
}