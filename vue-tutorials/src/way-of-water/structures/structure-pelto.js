import StructureBase from './structure-base'

export default class StructurePelto extends StructureBase {

    structureName = "Pelto"

    getOutputDataFromStructure(inputData) {
        if (inputData.cleanWater >= 2) {
            inputData.cleanWater -= 2
            
            var createdFood = 2 - inputData.dirtyWater < 0 ? 0 : 2 - inputData.dirtyWater

            if (createdFood == 2) {
                inputData.dirtyWater++
                inputData.thisTurnActions.push(`${this.structureName} created ${ createdFood }`)
            }

            inputData.food += createdFood
        }

        return inputData
    }
}