import StructureBase from './structure-base'

export default class StructureMeri  extends StructureBase {
    structureName ="Meri"
    
    getOutputDataFromStructure(inputData) {
        inputData = super.getOutputDataFromStructure(inputData)

        this.storedData.dirtyWater = inputData.dirtyWater
        inputData.thisTurnActions.push(`${this.structureName} now has ${this.storedData.dirtyWater} (${ inputData.dirtyWater } new) dirty water.`)

        inputData.food -= 1// Math.ceil(inputData.currentTurn)

        inputData = this.checkLosingConditions(inputData)

        return inputData
    }
    
    checkLosingConditions(inputData) {
        if (this.storedData.dirtyWater >= 6) {
            inputData.gameLost = true
            inputData.gameLostReason = `Too much dirty water.`
            inputData.thisTurnActions.push(`Game was lost, since there was too much dirty water.`)
        }
        // This causes every game to lose.
        // if (inputData.food < 0) {
        //     inputData.gameLost = true
        //     inputData.gameLostReason = `Not enough food.`
        //     inputData.thisTurnActions.push(`Game was lost, since there wasn't enough food.`)
        // }

        return inputData
    }
}