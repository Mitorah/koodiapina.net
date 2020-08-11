import StructureBase from './structure-base'

export default class StructureKaivos extends StructureBase {
    structureName = "Kaivos"

    getOutputDataFromStructure(inputData) {
        inputData = super.getOutputDataFromStructure(inputData)
        return inputData
    }

    functionality(inputData) {
        if (inputData.cleanWater > 2) {
            inputData.cleanWater -= 2
            inputData.dirtyWater += 2
            inputData.diamond += 1
        }
    }
}