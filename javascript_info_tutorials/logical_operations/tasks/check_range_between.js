/*
Write an “if” condition to check that age is between 14 and 90 inclusively.

“Inclusively” means that age can reach the edges 14 or 90.
*/

let age = prompt(`What is your age?`);

let message = 
(age >= 14 && age <= 90) ? `Your age is between 14 and 90! (inclusively)` :
``;

alert(message);
