/*
Write a function min(a,b) which returns the least of two numbers a and b.

Write a function pow(x,n) that returns x in power n. Or, in other words, multiplies x by itself n times and returns the result.

Create a web-page that prompts for x and n, and then shows the result of pow(x,n).
P.S. In this task the function should support only natural values of n: integers up from 1.
*/

let a = prompt(`a;`);
let b = prompt(`b:`)

alert(`${min(a,b)} is smaller.`)

let x = prompt(`x:`)
let n = 0;

// Make sure n is 1 or greater.
while (n < 1) {
    n = prompt(`n:`)
}

alert(`${x} pow ${n}: ${pow(x,n)}`)

function min(a, b) {
    return a < b ? a : b;
}

function pow(x, n) {
    // Easy way to use lib //return Math.pow(x, n);
    let result = x
    let i = 0;

    while (++i < n) {
        result *= x;
    }
    
    return result
}
