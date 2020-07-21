import StructureBase from './structure-base'

export default class StructureMeri  extends StructureBase {
    
    getOutputDataFromStructure(inputData) {
        this.storedData.dirtyWater += inputData.dirtyWater
        this.turnActions.push(`${this.structureName} now has 
            ${this.storedData.dirtyWater} (${ inputData.dirtyWater } new)`)

        inputData.food -= Math.ceil(inputData.currentTurn)

        inputData = this.checkLosingConditions(inputData)

        return inputData
    }
    
    checkLosingConditions(inputData) {
        if (this.storedData.dirtyWater >= 6) {
            inputData.gameLost = true
            inputData.gameLostReason = "Too much dirty water."
        }
        if (inputData.food < 0) {
            inputData.gameLost = true
            inputData.gameLostReason = "Not enought food."
        }

        return inputData
    }
}