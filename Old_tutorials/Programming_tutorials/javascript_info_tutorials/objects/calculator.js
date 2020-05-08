/*
Create an object calculator with three methods:

read() prompts for two values and saves them as object properties.
sum() returns the sum of saved values.
mul() multiplies saved values and returns the result.
*/

let calculator = {
    read: function() {
        this.valueA = +prompt(`Give me value A:`, 0)
        this.valueB = +prompt(`Give me value B:`, 0)
    },
    sum: function() {
        return this.valueA + this.valueB;
    },
    mul: function() {
        return this.valueA * this.valueB;
    }
}   

calculator.read();
alert(calculator.sum());
alert(calculator.mul());