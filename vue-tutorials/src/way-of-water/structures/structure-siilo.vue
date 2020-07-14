<script>
import StructureBase from './structure-base.vue'

export default class StructureSiilo extends StructureBase {
    slots = 3
    turnActions = [""]
    structureActions = [
        "asd"
        // this.storeNothing,
        // this.storeOneFood,
        // this.storeTwoFoods,
        // this.storeThreeFoods,
        // this.storeOneDiamond,
        // this.storeTwoDiamonds,
        // this.storeThreeDiamonds,
        // this.storeOneFoodOneDiamond,
        // this.storeOneFoodTwoDiamonds,
        // this.storeTwoFoodOneDiamond
    ]



    generateGameActions(totalTurns) {
        console.log("structure-siilo: " +  totalTurns+ ": " + this.structureActions)
        for(let i = 0; i < totalTurns; i++) {
            this.turnActions.push(this.structureActions[0])
        }
    }
        
    getOutputDataFromStructure(inputData) {
        return this.turnActions[inputData.currentTurn](inputData)
    }

    tryToStoreItems(inputData, amountOfFoodToStore, amountOfDiamondsToStore) {
        if (inputData.diamond + inputData.food >= this.slots) {
            // Slots full
        }
        else {
            if (this.storedData.food < amountOfFoodToStore) {
                if (inputData.food > 0) {
                    inputData.food--
                    this.storedData++
                    return this.tryToStoreItems(inputData, amountOfFoodToStore, amountOfDiamondsToStore)
                }
            }

            if (this.storedData.diamonds < amountOfDiamondsToStore) {
                if (inputData.diamonds > 0) {
                    inputData.diamonds--
                    this.storedData.diamonds++
                    return this.tryToStoreItems(inputData, amountOfFoodToStore, amountOfDiamondsToStore)
                }
            }
        }

        return this.tryToFreeSlots(inputData, amountOfFoodToStore, amountOfDiamondsToStore)
    }
    
    tryToFreeSlots(inputData, amountOfFoodToStore, amountOfDiamondsToStore) {
        
        if (this.storedData.food > amountOfFoodToStore) {
            inputData.food += this.storedData.food - amountOfFoodToStore
            this.storedData.food = amountOfFoodToStore
        }

        if (this.storeData.diamonds > amountOfDiamondsToStore) {
            inputData.diamonds += this.storedData.diamonds - amountOfDiamondsToStore
            this.storedData.diamonds = amountOfDiamondsToStore
        }

        return inputData
    }
    
    // storeNothing(inputData) {
    //     return this.tryToStoreItems(inputData, 0, 0)
    // }
    
    // storeOneFood(inputData) {
    //     return this.tryToStoreItems(inputData, 1, 0)
    // }
    
    // storeTwoFoods(inputData) {
    //     return this.tryToStoreItems(inputData, 2, 0)
    // }
    
    // storeThreeFoods(inputData) {
    //     return this.tryToStoreItems(inputData, 3, 0)
    // }
    
    // storeOneDiamond(inputData) {
    //     return this.tryToStoreItems(inputData, 0, 1)
    // }
    
    // storeTwoDiamonds(inputData) {
    //     return this.tryToStoreItems(inputData, 0, 2)
    // }
    
    // storeThreeDiamonds(inputData) {
    //     return this.tryToStoreItems(inputData, 0, 3)
    // }
    
    // storeOneFoodOneDiamond(inputData) {
    //     return this.tryToStoreItems(inputData, 1, 1)
    // }
    
    // storeOneFoodTwoDiamonds(inputData) {
    //     return this.tryToStoreItems(inputData, 1, 2)
    // }
    
    // storeTwoFoodOneDiamond(inputData) {
    //     return this.tryToStoreItems(inputData, 2, 1)
    // }
}
</script>

<style>

</style>