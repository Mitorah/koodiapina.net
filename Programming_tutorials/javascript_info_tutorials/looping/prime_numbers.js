/*
An integer number greater than 1 is called a prime if it cannot be divided without a remainder by anything except 1 and itself.

In other words, n > 1 is a prime if it can’t be evenly divided by anything except 1 and n.

For example, 5 is a prime, because it cannot be divided without a remainder by 2, 3 and 4.

Write the code which outputs prime numbers in the interval from 2 to n.

For n = 10 the result will be 2,3,5,7.

P.S. The code should work for any n, not be hard-tuned for any fixed value.
*/

let n = 0;

while (n < 1 || n > 1000)
{
    n = prompt(`Give number to check for prime numbers (1 - 1000):`)
}


let results = `Prime numbers up to ${n}: `;

// Check every number up to n.
for (let i = 2; i <= n; i++) {
    
    // Initialise boolean.
    let isPrime = true;

    // Check for prime.
    for (let j = 2; j < i; j++) {
        // If remainder is 0, it is not a prime.
        if (i % j == 0) {
            isPrime = false;
            break;
        }
    }

    if (isPrime)
        results += `${i} `;
}

alert(results);
