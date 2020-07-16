import StructureBase from './structure-base'

export default class StructureMylly extends StructureBase {
    
    getOutputDataFromStructure(inputData) {
        if (inputData.cleanWater >= 1) {
            inputData.cleanWater--

            if (inputData.food >= 2) {
                inputData.food -= 2

                var createdFood = 3 - inputData.dirtyWater < 0 ? 0 : 3 - inputData.dirtyWater

                inputData.food += createdFood
            }
        }

        return inputData
    }
}