<script>
export default class StructureBase {
    turnActions = [""]
    structureActions = [""]
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
        console.log("StructureBase - constructor")
    }

    generateGameActions(totalTurns) {
        console.log("structure-base: " + totalTurns)
        // for(let i = 0; i < totalTurns; i++) {
            //     this.turnAction.push(this.structureActions[0])
        // }
    }

    getOutputDataFromStructure(inputData) {
        // Overwrite in inheritedObject
        console.log(inputData)
    }
}
</script>

<style>

</style>