// 1. Variables and Data Types
let aName = "john";
let age = 10;
let isStudent = true;

console.log("name:",aName);
console.log(age);
console.log(isStudent);
console.log(typeof aName)
console.log(typeof age)
console.log(typeof isStudent)

// 2. Basic Arithmetic Operations
let x = 10;
let y = 20;


console.log("x =", x);
console.log("y =", y);
console.log("x + y =", x + y);
console.log("x - y =", x - y);
console.log("x * y =", x * y);
console.log("x / y =", x / y);

// 3. Working with Strings
let sentence = "this is a very long sentence";
console.log(sentence);
console.log("sentence length is",sentence.length);
console.log("sentence first char is", sentence[0]);
console.log("sentence last char is", sentence[sentence.length-1]);

// 4. Math Object
let z = -4;
console.log("z =", z);
console.log("Square Root of positive of z is", Math.sqrt(-z));
console.log("Z square is", Math.pow(z, 2));
console.log("|z| =", Math.abs(z));

// 5. Boolean Logic and Comparison Operators
let a = 11;
let b = 21;
console.log("a =", a, "b =", b);
console.log("a > b is", a > b);
console.log("a < b is", a < b);
console.log("a == b is", a == b);

// 6. Logical Operators
let firstBool = true;
let secondBool = false;

console.log("true and false is", firstBool && secondBool);
console.log("true or false is", firstBool || secondBool);
console.log("not true is", !firstBool);
console.log("not false is", !secondBool);

// 7. Using Template Literals
let firstName = "Tom";
let lastName = "Jerry";
let greeting = `Hello, my name is ${firstName} ${lastName}`;
console.log(greeting)