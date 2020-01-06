/*
- Use the for loop to output even numbers from 2 to 10.
*/

alert(`Use the for loop to output even numbers from 2 to 10.`)

for (let i = 2; i < 10; i++) {
    if (i % 2 == 0) 
        alert(i);
}

/*
- Rewrite the code changing the for loop to while without altering its behavior (the output should stay same).
*/

alert(`Rewrite the code changing the for loop to while without altering its behavior (the output should stay same).`);

while (i++ < 10) {
    if (i % 2 == 0)
        alert(i);
}