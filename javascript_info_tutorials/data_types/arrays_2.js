/*
--- Task 1 ---
Write the function camelize(str) that changes dash-separated words like “my-short-string” into camel-cased “myShortString”.

That is: removes all dashes, each word after dash becomes uppercased.

Examples:

camelize("background-color") == 'backgroundColor';
camelize("list-style-image") == 'listStyleImage';
camelize("-webkit-transition") == 'WebkitTransition';
P.S. Hint: use split to split the string into an array, transform it and join back.
*/

alert(`Task 1 --- 
Write the function camelize(str) that changes dash-separated words like 
“my-short-string” into camel-cased “myShortString”.
`);

function camelize(str) {
    let arrSplitted = str.split('-');
    let result = "";
    
    for (item in arrSplitted) {
        if (arrSplitted[item].length == 0)
            continue;

        result += arrSplitted[item][0].toUpperCase() + arrSplitted[item].slice(1).toLowerCase();
    };

    return result;
};

let exampleInputs = [
    "background-color", 
    "list-style-image", 
    "-webkit-transition",
];

for (item in exampleInputs) {
    alert(`${exampleInputs[item]} => ${camelize(exampleInputs[item])}.`);
}

/*
--- Task 2 ---
Write a function filterRange(arr, a, b) that gets an array arr, looks for elements between a and b in it and returns an array of them.

The function should not modify the array. It should return the new array.

For instance:

let arr = [5, 3, 8, 1];

let filtered = filterRange(arr, 1, 4);

alert( filtered ); // 3,1 (matching values)

alert( arr ); // 5,3,8,1 (not modified)
*/
alert(`Task - 2 --- 
Write a function filterRange(arr, a, b) that gets an array arr, 
looks for elements between a and b in it and returns an array of them.
`)

function filterRange(arr, a, b) {
    let results = [];
    let lower = a > b ? b : a;
    let higher = a > b ? a : b;

    for (item in arr) {
        if (arr[item] < lower || arr[item] > higher)
            continue;

        results.push(arr[item]);
    }
    return results;
}
let arr = [5, 3, 8, 1];

let filtered = filterRange(arr, 1, 4);

alert(`Filtering ${arr} with 1 and 4: ${filtered} while input array is untouched.`)

/*
--- Task 3 ---
Write a function filterRangeInPlace(arr, a, b) that gets an array arr and removes from it all values except those that are between a and b. The test is: a ≤ arr[i] ≤ b.

The function should only modify the array. It should not return anything.

For instance:

let arr = [5, 3, 8, 1];

filterRangeInPlace(arr, 1, 4); // removed the numbers except from 1 to 4

alert( arr ); // [3, 1]
*/
alert(`Task 3 --- 
Write a function filterRangeInPlace(arr, a, b) 
that gets an array arr and removes from it all values except 
those that are between a and b. The test is: a ≤ arr[i] ≤ b.
`)

function filterRangeInPlace(arr, a, b) {

    let lower = a > b ? b : a;
    let higher = a > b ? a : b;

    for (let i = 0; i < arr.length; i++) {
        if (arr[i] < lower || arr[i] > higher) {
            arr.splice(i, 1);
            i--;
        }
    }
}

let examplearr = [5, 3, 8, 1];

alert(`Before: ` + examplearr);
filterRangeInPlace(examplearr, 1, 4);
alert(`After: ` + examplearr);

/*
--- Task 4 ---
let arr = [5, 2, 1, -10, 8];

// ... your code to sort it in decreasing order

alert( arr ); // 8, 5, 2, 1, -10
*/
alert(`Task 4 --- Arrange array in decreasing order`);

examplearr = [5, 2, 1, -10, 8];

alert(`Before: ` + examplearr);

examplearr.sort((a, b) => a < b ? 1 : -1);

alert(`After: ` + examplearr);

/*
--- Task 5 ---
We have an array of strings arr. We’d like to have a sorted copy of it, but keep arr unmodified.

Create a function copySorted(arr) that returns such a copy.

let arr = ["HTML", "JavaScript", "CSS"];

let sorted = copySorted(arr);

alert( sorted ); // CSS, HTML, JavaScript
alert( arr ); // HTML, JavaScript, CSS (no changes)
*/
alert(`Task 5 --- 
We have an array of strings arr. 
We’d like to have a sorted copy of it, but keep arr unmodified.
`)

function copySorted(arr) {
    let sorted = arr.slice(0);
    sorted.sort((a, b) => a > b ? 1 : -1);
    return sorted;
}

examplearr = ["HTML", "JavaScript", "CSS"];

let sorted = copySorted(examplearr);

alert(`Sorted (CSS, HTML, JavaScript): ` + sorted ); // CSS, HTML, JavaScript
alert(`Untouched (HTML, JavaScript, CSS): ` + examplearr ); // HTML, JavaScript, CSS (no changes)


/*
--- Task 6 ---
You have an array of user objects, each one has user.name. Write the code that converts it into an array of names.

For instance:

let john = { name: "John", age: 25 };
let pete = { name: "Pete", age: 30 };
let mary = { name: "Mary", age: 28 };

let users = [ john, pete, mary ];

let names = // ... your code

alert( names ); // John, Pete, Mary
*/

alert(`Task 6 --- 
You have an array of user objects, 
each one has user.name. Write the code that converts it into an array of names.\n
let john = { name: "John", age: 25 };
let pete = { name: "Pete", age: 30 };
let mary = { name: "Mary", age: 28 };
`);

let john = { name: "John", age: 25 };
let pete = { name: "Pete", age: 30 };
let mary = { name: "Mary", age: 28 };

let users = [ john, pete, mary ];

let names = users.map(item => item.name);

alert(`(John, Pete, Mary): ` + names ); // John, Pete, Mary

/*
--- Task 7 ---
You have an array of user objects, each one has name, surname and id.

Write the code to create another array from it, of objects with id and fullName, where fullName is generated from name and surname.

For instance:

let john = { name: "John", surname: "Smith", id: 1 };
let pete = { name: "Pete", surname: "Hunt", id: 2 };
let mary = { name: "Mary", surname: "Key", id: 3 };

let users = [ john, pete, mary ];

let usersMapped = // ... your code ...

usersMapped = [
  { fullName: "John Smith", id: 1 },
  { fullName: "Pete Hunt", id: 2 },
  { fullName: "Mary Key", id: 3 }
]

alert( usersMapped[0].id ) // 1
alert( usersMapped[0].fullName ) // John Smith
So, actually you need to map one array of objects to another. Try using => here. There’s a small catch.
*/
alert(`Task 7 --- 
You have an array of user objects, each one has name, surname and id.
Write the code to create another array from it, of objects with id and fullName, where fullName is generated from name and surname.
`)

john = { name: "John", surname: "Smith", id: 1 };
pete = { name: "Pete", surname: "Hunt", id: 2 };
mary = { name: "Mary", surname: "Key", id: 3 };

users = [ john, pete, mary ];

let usersMapped = users.map(value => ({
    fullName: value.name + ` ` + value.surname,
    id: value.id,
})
);

let results = "";
for (item in usersMapped) {
    results += usersMapped[item].id;
    results += ": ";
    results += usersMapped[item].fullName;
    results += "\n";
};

alert(results);

/*
--- Task 8 ---
Write the function sortByAge(users) that gets an array of objects with the age property and sorts them by age.

For instance:

let john = { name: "John", age: 25 };
let pete = { name: "Pete", age: 30 };
let mary = { name: "Mary", age: 28 };

let arr = [ pete, john, mary ];

sortByAge(arr);

// now: [john, mary, pete]
alert(arr[0].name); // John
alert(arr[1].name); // Mary
alert(arr[2].name); // Pete
*/

/*
--- Task 9 ---
Write the function shuffle(array) that shuffles (randomly reorders) elements of the array.

Multiple runs of shuffle may lead to different orders of elements. For instance:

let arr = [1, 2, 3];

shuffle(arr);
// arr = [3, 2, 1]

shuffle(arr);
// arr = [2, 1, 3]

shuffle(arr);
// arr = [3, 1, 2]
// ...
All element orders should have an equal probability. For instance, [1,2,3] can be reordered as [1,2,3] or [1,3,2] or [3,1,2] etc, with equal probability of each case.
*/

/*
--- Task 10 ---
Write the function getAverageAge(users) that gets an array of objects with property age and returns the average age.

The formula for the average is (age1 + age2 + ... + ageN) / N.

For instance:

let john = { name: "John", age: 25 };
let pete = { name: "Pete", age: 30 };
let mary = { name: "Mary", age: 29 };

let arr = [ john, pete, mary ];

alert( getAverageAge(arr) ); // (25 + 30 + 29) / 3 = 28

*/

/*
--- Task 11 --- 
Let arr be an array.

Create a function unique(arr) that should return an array with unique items of arr.

For instance:

function unique(arr) {
  // your code
}

let strings = ["Hare", "Krishna", "Hare", "Krishna",
  "Krishna", "Krishna", "Hare", "Hare", ":-O"
];

alert( unique(strings) ); // Hare, Krishna, :-O

*/

/*
--- Task 12 ---
Let’s say we received an array of users in the form {id:..., name:..., age... }.

Create a function groupById(arr) that creates an object from it, with id as the key, and array items as values.

For example:

let users = [
  {id: 'john', name: "John Smith", age: 20},
  {id: 'ann', name: "Ann Smith", age: 24},
  {id: 'pete', name: "Pete Peterson", age: 31},
];

let usersById = groupById(users);

// after the call we have:

usersById = {
  john: {id: 'john', name: "John Smith", age: 20}
  ann: {id: 'ann', name: "Ann Smith", age: 24},
  pete: {id: 'pete', name: "Pete Peterson", age: 31},
}

Such function is really handy when working with server data.

In this task we assume that id is unique. There may be no two array items with the same id.

Please use array .reduce method in the solution.
*/