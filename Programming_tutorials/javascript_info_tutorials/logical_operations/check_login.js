/*
Write the code which asks for a login with prompt.

If the visitor enters "Admin", then prompt for a password, if the input is an empty line or Esc – show “Canceled”, 
if it’s another string – then show “I don’t know you”.

The password is checked as follows:

If it equals “TheMaster”, then show “Welcome!”,
Another string – show “Wrong password”,
For an empty string or cancelled input, show “Canceled”
*/

let result = prompt(`Login:`);

// Login correct
if (result == "Admin") {
    
    let pwResult = prompt(`Password:`);

    // Password correct, all good.
    if (pwResult == "TheMaster") {
        alert(`Welcome!`)
    }
    // Password not correct.
    else
    {
        if (!!pwResult) {
            alert(`Wrong password.`);
        }
        else {
            alert(`Cancelled`);
        }
    }
}
// Login not correct
else
{
    if (!!result) {
        alert(`I don't know you!`);
    }
    else {
        alert(`Cancelled.`);
    }
}
