/*
Write an if condition to check that age is NOT between 14 and 90 inclusively.

Create two variants: the first one using NOT !, the second one – without it.
*/

let age = prompt(`What is your age?`);

let message = 
!(age > 90) && !(age < 14) ? `(1)Your age is between 14 and 90.`
: `(1)Your age is NOT between 14 and 90.`;

alert(message);

let secondMessage =
(age > 90 || age < 14) ? `(2)Your age is NOT between 14 and 90.`
: `(2)Your age is between 14 and 90.`

alert(secondMessage);
