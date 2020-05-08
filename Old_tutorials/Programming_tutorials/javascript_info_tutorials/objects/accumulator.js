/*
Create a constructor function Accumulator(startingValue).

Object that it creates should:

Store the “current value” in the property value. The starting value is set to the argument of the constructor startingValue.
The read() method should use prompt to read a new number and add it to value.
In other words, the value property is the sum of all user-entered values with the initial value startingValue.

Here’s the demo of the code:

let accumulator = new Accumulator(1); // initial value 1

accumulator.read(); // adds the user-entered value
accumulator.read(); // adds the user-entered value

alert(accumulator.value); // shows the sum of these values

* Added exercise

Create a function readNumber which prompts for a number until the visitor enters a valid numeric value.

The resulting value must be returned as a number.

The visitor can also stop the process by entering an empty line or pressing “CANCEL”. In that case, the function should return null.


*/

function Accumulator(startingValue) {
    this.value = startingValue;
    
    this.read = function() {
        let givenValue = "";
        
        do {
            givenValue = prompt(`Insert number:`,0);
        } while (!isFinite(givenValue));

        if (givenValue === null || givenValue === '')
            return;

        this.value += +givenValue;
    }
}

let acc = new Accumulator(10);

acc.read();
acc.read();

alert(acc.value);