import StructureBase from './structure-base'

export default class StructureSiilo extends StructureBase {
    structureName="Siilo"
    
    slots = 3
    structureActions = [
        (data) => this.storeNothing(data),
        (data) => this.storeOneFood(data),
        (data) => this.storeTwoFoods(data),
        (data) => this.storeThreeFoods(data),
        (data) => this.storeOneDiamond(data),
        (data) => this.storeTwoDiamonds(data),
        (data) => this.storeThreeDiamonds(data),
        (data) => this.storeOneFoodOneDiamond(data),
        (data) => this.storeOneFoodTwoDiamonds(data),
        (data) => this.storeTwoFoodOneDiamond(data)
    ]
        
    getOutputDataFromStructure(inputData) {
        inputData = super.getOutputDataFromStructure(inputData)

        return this.turnActions[inputData.currentTurn](inputData)
    }

    tryToStoreItems(inputData, amountOfFoodToStore, amountOfDiamondsToStore) {
        if (inputData.diamond + inputData.food >= this.slots) {
            // Slots full
            inputData.thisTurnActions.push(`${this.structureName} was full and did nothing.`)
        }
        else {
            if (this.storedData.food < amountOfFoodToStore) {
                if (inputData.food > 0) {
                    inputData.food--
                    this.storedData++
                    inputData.thisTurnActions.push(`${this.structureName} stored a food.`)
                    return this.tryToStoreItems(inputData, amountOfFoodToStore, amountOfDiamondsToStore)
                }
            }

            if (this.storedData.diamonds < amountOfDiamondsToStore) {
                if (inputData.diamonds > 0) {
                    inputData.diamonds--
                    this.storedData.diamonds++
                    inputData.thisTurnActions.push(`${this.structureName} stored a diamond.`)
                    return this.tryToStoreItems(inputData, amountOfFoodToStore, amountOfDiamondsToStore)
                }
            }
        }

        return this.tryToFreeSlots(inputData, amountOfFoodToStore, amountOfDiamondsToStore)
    }
    
    tryToFreeSlots(inputData, amountOfFoodToStore, amountOfDiamondsToStore) {
        
        if (this.storedData.food > amountOfFoodToStore) {
            var amountOfFoodFreed = this.storedData.food - amountOfFoodToStore
            inputData.food += amountOfFoodFreed
            this.storedData.food = amountOfFoodToStore
            inputData.thisTurnActions.push(`${this.structureName} freed ${amountOfFoodFreed}`)
        }

        if (this.storedData.diamond > amountOfDiamondsToStore) {
            var amountOfDiamondsFreed = this.storedData.diamond - amountOfDiamondsToStore
            inputData.diamond += amountOfDiamondsFreed
            this.storedData.diamond = amountOfDiamondsToStore
            inputData.thisTurnActions.push(`${this.structureName} freed ${amountOfDiamondsFreed}`)
        }

        return inputData
    }
    
    storeNothing(inputData) {
        return this.tryToStoreItems(inputData, 0, 0)
    }
    
    storeOneFood(inputData) {
        return this.tryToStoreItems(inputData, 1, 0)
    }
    
    storeTwoFoods(inputData) {
        return this.tryToStoreItems(inputData, 2, 0)
    }
    
    storeThreeFoods(inputData) {
        return this.tryToStoreItems(inputData, 3, 0)
    }
    
    storeOneDiamond(inputData) {
        return this.tryToStoreItems(inputData, 0, 1)
    }
    
    storeTwoDiamonds(inputData) {
        return this.tryToStoreItems(inputData, 0, 2)
    }
    
    storeThreeDiamonds(inputData) {
        return this.tryToStoreItems(inputData, 0, 3)
    }
    
    storeOneFoodOneDiamond(inputData) {
        return this.tryToStoreItems(inputData, 1, 1)
    }
    
    storeOneFoodTwoDiamonds(inputData) {
        return this.tryToStoreItems(inputData, 1, 2)
    }
    
    storeTwoFoodOneDiamond(inputData) {
        return this.tryToStoreItems(inputData, 2, 1)
    }
}