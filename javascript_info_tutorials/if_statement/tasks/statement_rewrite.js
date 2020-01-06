/* Rewrite to ?-operator
let result;

if (a + b < 4) {
  result = 'Below';
} else {
  result = 'Over';
}
*/

let result = (a + b < 4 ) ? 'Below' : 'Over';
alert(result);