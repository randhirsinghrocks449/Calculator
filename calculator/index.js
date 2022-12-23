const readline = require("readline").createInterface({
  input: process.stdin,
  output: process.stdout,
  terminal: false,
});

const isNumRegex = /^\d+$/;
const isOperator = (str) =>
  str === "+" || str === "-" || str === "/" || str === "*";
const isValidChar = (str) =>
  isNumRegex.test(str) || isOperator(str) || str === ".";

const doCalculation = (num1, num2, operator) => {
  if (operator === "+") {
    return num1 + num2;
  } else if (operator === "-") {
    return num1 - num2;
  } else if (operator === "/") {
    return num1 / num2;
  } else if (operator === "*") {
    return num1 * num2;
  }
};

const askSingleInput = () => {
  return new Promise((res, rej) => {
    readline.question("", (newInput) => {
      res(newInput);
    });
  });
};

const askUserInput = (str) => {
  return new Promise(async (res, rej) => {
    if (str === "exit") {
      return res("exit");
    }
    const mathCalculationArray = str.split("").filter((el) => isValidChar(el));
    const mathCalculationArr = [];

    // convert [45, + , + , 45] into [45, +, 45]
    mathCalculationArray.forEach((el, i) => {
      if (isValidChar(el)) {
        if (isOperator(el)) {
          // if previous index is also operator so don't add current operator
          if (!isOperator(mathCalculationArr[i - 1])) {
            mathCalculationArr.push(el);
          }
        } else {
          // Push number to arr
          mathCalculationArr.push(el);
        }
      }
    });

    const reduceNumber = [];

    let lastNumber = "";
    mathCalculationArr.forEach((element) => {
      if (isOperator(element)) {
        reduceNumber.push(parseFloat(lastNumber));
        lastNumber = "";
        reduceNumber.push(element);
      } else {
        lastNumber += element;
      }
    });
    // If last value is zero and last push in reduce number is an operator
    // Because we don't
    if (
      parseInt(mathCalculationArr[mathCalculationArr.length - 1]) === "0" &&
      isOperator(reduceNumber[reduceNumber.length - 1])
    ) {
      reduceNumber.push(mathCalculationArr[mathCalculationArr.length - 1]);
    } else if (lastNumber !== "") {
      reduceNumber.push(parseFloat(lastNumber));
    }

    if (reduceNumber.length) {
      let answer = 0;
      let firstCalculationFlag = false;
      let i = 0;
      while (i < reduceNumber.length) {
        if (isOperator(reduceNumber[i]) && !firstCalculationFlag) {
          const num1 = reduceNumber[i - 1] || 0;
          const num2 = reduceNumber[i + 1] || 0;
          const operator = reduceNumber[i];
          answer = doCalculation(num1, num2, operator);
          firstCalculationFlag = true;

          i += 2;
          continue;
        } else if (isOperator(reduceNumber[i])) {
          const num1 = answer;
          const num2 = reduceNumber[i + 1] || 0;
          const operator = reduceNumber[i];
          answer = doCalculation(num1, num2, operator);
          i += 2;
          continue;
        }
        i++;
      }
      console.log({ answer });
    }
    const newInput = await askSingleInput();
    const result = askUserInput(newInput);
    res(result);
  });
};

readline.question(
  "Welcome! Enter a calculation, I'll give you the answer \n",
  async (input) => {
    let userInput = input;
    await askUserInput(userInput);
    readline.close();
  }
);
