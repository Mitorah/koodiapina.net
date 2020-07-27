import StructureBase from './structure-base'

export default class StructureMetsastaja extends StructureBase {
    structureName = "Metsästäjä"

    getOutputDataFromStructure(inputData) {
        inputData = super.getOutputDataFromStructure(inputData)

        if (this.storedData.cleanWater == 0 && inputData.cleanWater > 0) {
            this.storedData.cleanWater++
            inputData.cleanWater--
            inputData.thisTurnActions.push(`${this.structureName} stored clean water.`)
        }
        else if (this.storedData.cleanWater > 0) {
            this.storedData.cleanWater--
            inputData.food++
            inputData.thisTurnActions.push(`Got food from ${this.structureName}`)
        }
        else {
            inputData.thisTurnActions.push(`${this.structureName} did nothing.`)
        }


        return inputData
    }
}