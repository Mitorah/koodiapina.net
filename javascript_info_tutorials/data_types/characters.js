/*
-- Task 1 --
Write a function ucFirst(str) that returns the string str with the uppercased first character, for instance:

ucFirst("john") == "John";
*/

function ucFirst(str) {
    if (!str)
        return str;

    if (str.length < 2)
        return str[0].toUpperCase();

    return str[0].toUpperCase() + str.slice(1).toLowerCase();
}

let exampleStr = "UppErcaSE";
alert(`${exampleStr} is ${ucFirst(exampleStr)}`);

/*
-- Task 2 --
Write a function checkSpam(str) that returns true if str contains ‘viagra’ or ‘XXX’, otherwise false.

The function must be case-insensitive:

checkSpam('buy ViAgRA now') == true
checkSpam('free xxxxx') == true
checkSpam("innocent rabbit") == false
*/

function checkSpam(str) {
    return (str.toLowerCase().includes(`viagra`) || str.toLowerCase().includes(`xxx`));
}

alert(`\"buy ViAgRA now\" is ${checkSpam('buy ViAgRA now')}`);
alert(`\"free xxxx\" is ${checkSpam(`free xxx`)}`);
alert(`\"innocent rabbit\" is ${checkSpam(`innocent rabbit`)}`);

/*
-- Task 3 --
Create a function truncate(str, maxlength) that checks the length of the str and, 
if it exceeds maxlength – replaces the end of str with the ellipsis character "…", to make its length equal to maxlength.

The result of the function should be the truncated (if needed) string.

For instance:

truncate("What I'd like to tell on this topic is:", 20) = "What I'd like to te…"

truncate("Hi everyone!", 20) = "Hi everyone!"
*/

function truncate(str, maxlength) {
    return str.length > maxlength ? str.slice(0, maxlength - 1) + '…' : str;
}

exampleStr = `What I'd like to tell on this topic is:`
alert(`\"${exampleStr}\" -> ${truncate(exampleStr, 20)} \nwhen maximum length is 20`);

exampleStr = `Hi everyone!`;
alert(`\"${exampleStr}\" -> ${truncate(exampleStr, 20)} \nwhen maximum length is 20`);

/*
--- Task 4 ---
We have a cost in the form "$120". That is: the dollar sign goes first, and then the number.

Create a function extractCurrencyValue(str) that would extract the numeric value from such string and return it.

The example:

alert( extractCurrencyValue('$120') === 120 ); // true
*/

function extractCurrency(str) {
    let result = "";

    for (value in str) {

        if (!isFinite(str[value]))
            continue;
        
        result += str[value];
    }
    
    return result;
}

alert(`Extracting currency from \$120: ${extractCurrency('\$120')}`);