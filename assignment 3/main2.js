//Challenge 2: PIN Validator (Do-While Loop)

const correctPIN = 1234;
let PIN; 
do {
    PIN = prompt("Enter 4-digits PIN: ");
}
while (PIN != correctPIN)

alert("Access Granted!")