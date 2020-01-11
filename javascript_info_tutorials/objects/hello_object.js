/*
Write the code, one line for each action:

Create an empty object user.
Add the property name with the value John.
Add the property surname with the value Smith.
Change the value of the name to Pete.
Remove the property name from the object.
*/

let user = {};
user.name = "John";
user.surname = "Smith";
alert(`Name: ${user.name}, Surname: ${user.surname}.`)

user.name = "Pete";
alert(`After change. Name: ${user.name}, Surname: ${user.surname}.`)

delete user.name;
alert(`After deletion. Name: ${user.name}, Surname: ${user.surname}.`)
