<script>
export default {
    results: [],
    generateCombinations(objects) {
        this.results = [];

        this.FindAllPossibleCombinations(this.objects, [], this.objects.combinationLength,);

        return this.results;
    },
    findAllPossibleCombinations(objectPool, resultPool, combinationLength) {
        if (resultPool.length == combinationLength) {
            this.results.push(resultPool.slice(0));
            resultPool.pop();
            return;
        }

        for (var i = 0; i < objectPool.length; i++) {
            if (resultPool.includes(objectPool[i])) {
                continue;
            }

            resultPool.push(pool[i]);

            this.FindAllPossibleCombinations(objectPool, resultPool, combinationLength);
        }
    }
}
</script>