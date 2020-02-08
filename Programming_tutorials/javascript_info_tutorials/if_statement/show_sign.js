while (true)
{
    let result = prompt(`Give me a number.`);
    
    if (result > 0) {
        alert('1');
        break;
    }
    else if (result < 0) {
        alert('-1');
        break;
    }
    else if (result == 0) {
        alert('0');
        break;
    }
    else if (result == NaN) {
        alert(`${result} is not a number! I need a number!`)
    }
    else if (result == "") {
        break;
    }
}