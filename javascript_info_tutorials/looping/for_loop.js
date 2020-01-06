/*
- Use the for loop to output even numbers from 2 to 10.
*/

alert(`Use the for loop to output even numbers from 2 to 10.`)

for (let i = 2; i <= 10; i++) {
    if (i % 2 == 0) 
        alert(i);
}

/*
- Rewrite the code changing the for loop to while without altering its behavior (the output should stay same).
*/

alert(`Rewrite the code changing the for loop to while without altering its behavior (the output should stay same).`);
let iterator = 0;
while (iterator++ < 10) {
    if (iterator % 2 == 0)
        alert(iterator);
}