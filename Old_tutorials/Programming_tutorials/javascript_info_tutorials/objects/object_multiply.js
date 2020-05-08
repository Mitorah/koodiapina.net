/*
Create a function multiplyNumeric(obj) that multiplies all numeric properties of obj by 2.

For instance:

// before the call
let menu = {
  width: 200,
  height: 300,
  title: "My menu"
};

multiplyNumeric(menu);

// after the call
menu = {
  width: 400,
  height: 600,
  title: "My menu"
};
Please note that multiplyNumeric does not need to return anything. It should modify the object in-place.

P.S. Use typeof to check for a number here.
*/

let menu = {
    width: 200,
    height: 300,
    title: "My menu"
};

printOut(menu);

multiplyNumeric(menu);
  
printOut(menu);

function multiplyNumeric(menu) {
    for(menuitem in menu) {
        if (typeof(menu[menuitem]) == "number") {
            menu[menuitem] *= 2;
        }
    }

}

function printOut(menu) {
    let message = "Items:\n";

    for (menuitem in menu) {
        message += menu[menuitem] + "\n" 
    }
    
    alert(message)
}