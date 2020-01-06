/* Rewrite to ?-operator
let result;

if (a + b < 4) {
  result = 'Below';
} else {
  result = 'Over';
}
*/
let a = prompt('Give me a number(a):');
let b = prompt('Give me number(b):')

let result = (a + b < 4 ) ? `A + B is below 4 (${a+b})` : `A + B is equal or over 4 (${a+b})`;
alert(result);