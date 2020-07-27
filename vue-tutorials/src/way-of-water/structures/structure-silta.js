import StructureBase from './structure-base'

export default class StructureSilta extends StructureBase {
    structureName = "Silta"    

    getOutputDataFromStructure(inputData) {
        inputData = super.getOutputDataFromStructure(inputData)
        
        return inputData
    }
}