export default class StructureBase {
    
    structureName = "This is the name of the structure"

    turnActions = []
    structureActions = []
    turnData = {
        currentTurn: 0,
        foodUsedPerTurn: 0,
        cleanWater: 0,
        dirtyWater: 0,
        diamond: 0,
        food: 0
        }
        
    storedData = {
        cleanWater: 0,
        dirtyWater: 0,
        diamond: 0,
        food: 0
        }
        
    constructor() {
        this.storedData.cleanWater = 0
        this.storedData.dirtyWater = 0
        this.storedData.diamond = 0
        this.storedData.food = 0
    }

    generateGameActions(totalTurns) {
        // Push empty action here since there is no turn 0
        this.turnActions.push(() => {})

        if (this.structureActions.length > 0) {
            for(let i = 0; i < totalTurns; i++) {
                let index = Math.floor(Math.random() * this.structureActions.length)
                
                if (index >= this.structureActions.length) {
                    console.error(`Index [${index}] was out of range when adding structureactions to ${this.structureName}.`)
                }

                if (typeof this.structureActions[index] === "function") {
                    this.turnActions.push(this.structureActions[index])
                }
                else {
                    console.log(`${this.structureName}: There was no function at index ${index}. 
                        Trying to add ${this.structureActions[index]} typeof(${typeof this.structureActions[index]})`)
                }
            }
        }
    }

    getOutputDataFromStructure(inputData) {
        // Overwrite in inheritedObject
        return inputData
    }
}