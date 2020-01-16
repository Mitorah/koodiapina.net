/*
--- Task 1 ---
Let’s try 5 array operations.

Create an array styles with items “Jazz” and “Blues”.
Append “Rock-n-Roll” to the end.
Replace the value in the middle by “Classics”. Your code for finding the middle value should work for any arrays with odd length.
Strip off the first value of the array and show it.
Prepend Rap and Reggae to the array.
The array in the process:

Jazz, Blues
Jazz, Blues, Rock-n-Roll
Jazz, Classics, Rock-n-Roll
Classics, Rock-n-Roll
Rap, Reggae, Classics, Rock-n-Roll
*/
alert(`TASK 1`)
let styles = ["Jazz", "Blues"];
alert(styles);
styles.push("Rock-n-Roll");
alert(styles);
alert(styles.length % 2 == 1 ? (styles.length - 1) / 2 : styles.length / 2);
styles[styles.length % 2 == 1 ? (styles.length - 1) / 2 : styles.length / 2] = "Classics";
alert(styles);
alert(styles.shift(0) + ' removed.');
styles.unshift("Reggae");
alert(styles);
styles.unshift("Rap");
alert(styles);


/*
--- Task 2 ---
Write the function sumInput() that:

Asks the user for values using prompt and stores the values in the array.
Finishes asking when the user enters a non-numeric value, an empty string, or presses “Cancel”.
Calculates and returns the sum of array items.
P.S. A zero 0 is a valid number, please don’t stop the input on zero.
*/
alert(`TASK 2`)

function sumInput() {
    let values = [];
    let promptValue = 0;

    do {
        promptValue = +prompt(`Add value[${values.length < 1 ? 0 : values.length}]:`);
        
        // This should be ||, not && for performance
        if (isFinite(promptValue) && promptValue != "") {
            values.push(promptValue);
        }
    
        // This should be ||, not && for performance
    } while (isFinite(promptValue) && promptValue != "")

    for (let i = values.length - 1; i > 0; i--) {
        values[0] += values.pop();
    }

    return values[0];
}

alert(sumInput());


/*
--- Task 3 ---
The input is an array of numbers, e.g. arr = [1, -2, 3, 4, -9, 6].

The task is: find the contiguous subarray of arr with the maximal sum of items.

Write the function getMaxSubSum(arr) that will return that sum.

For instance:
getMaxSubSum([-1, 2, 3, -9]) = 5 (the sum of highlighted items)
getMaxSubSum([2, -1, 2, 3, -9]) = 6
getMaxSubSum([-1, 2, 3, -9, 11]) = 11
getMaxSubSum([-2, -1, 1, 2]) = 3
getMaxSubSum([100, -9, 2, -3, 5]) = 100
getMaxSubSum([1, 2, 3]) = 6 (take all)
If all items are negative, it means that we take none (the subarray is empty), so the sum is zero:

getMaxSubSum([-1, -2, -3]) = 0
Please try to think of a fast solution: O(n2) or even O(n) if you can.
*/
alert(`TASK 3`);
//TODO!
