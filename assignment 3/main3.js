//Challenge 3: Multiplication Table with Skips (For Loop + Continue)

let num = parseInt(prompt("Enter a number: "));

for (i = 0; i <= 10; i++){
    let result = num * i;
    if (result % 5 == 0){
        continue;
    }
    else
        console.log(`${num} x ${i} = ${result}`);
}