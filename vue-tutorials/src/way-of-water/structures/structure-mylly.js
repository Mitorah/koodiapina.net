import StructureBase from './structure-base'

export default class StructureMylly extends StructureBase {
    
    structureName = "Mylly"
    
    getOutputDataFromStructure(inputData) {
        if (inputData.cleanWater >= 1) {
            inputData.cleanWater--

            if (inputData.food >= 2) {
                inputData.food -= 2

                var createdFood = 3 - inputData.dirtyWater < 0 ? 0 : 3 - inputData.dirtyWater

                inputData.thisTurnActions.push(`${this.structureName} created ${createdFood} food.`)
                
                inputData.food += createdFood
            }
            else {
                inputData.thisTurnActions.push(`${this.structureName} used one clean water.`)
            }
        }
        else {
            inputData.thisTurnActions.push(`${this.structureName} did nothing.`)
        }

        return inputData
    }
}