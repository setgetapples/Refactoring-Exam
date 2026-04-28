// from First Chapter of Refactor Text
//  "If the program lacks structure, itÃ¢â‚¬â„¢s usually easier for me to add structure to the program first, and then make the change I need."
//  "In this case, I have a couple of changes that the users would like to make. First, they want a statement printed in HTML."
//    "IÃ¢â‚¬â„¢m faced with adding conditional statements around every statement that adds a string to the result. That will add a host of complexity to the function. 
//      Faced with that, most people prefer to copy the method and change it to emit HTML."
//  "...second change. The players are looking to perform more kinds of plays:..."
//    "But if I copy statement to htmlStatement, IÃ¢â‚¬â„¢d need to ensure that any changes are consistent. Furthermore, as the rules grow in complexity, 
//       itÃ¢â‚¬â„¢s going to be harder to figure out where to make the changes and harder to do them without making a mistake."


// "...the first step is always the same. I need to ensure I have a solid set of tests for that section of code.
// "The larger a program, the more likely it is that my changes will cause something to break inadvertentlyâ€
//   in the digital age, frailty's name is software."

// I recommend first playing with https://jsfiddle.net to get a little more comfortable with JavaScript
//   create json inputs for plays and invoice, e.g.
// let plays = require("./plays.json") // alternative to reading the .json file is to assign the value in this file 
let plays = 
{
  "hamlet": {"name": "Hamlet", "type": "tragedy"},
  "as-like": {"name": "As You Like It", "type": "comedy"},  // make sure the as-like key has the hyphen
  "othello": {"name": "Othello", "type": "tragedy"}
}


//   before unit testing, e.g. with statement.test.js, create plays.json, and a couple sample invoice inputs, e.g. 
//      invoice_0.json and invoice_1.json, as well as matching output keys statement_0.txt and statement_1.txt
//      then import/fetch/require them as appropriate into the statement.test.js test file, e.g.
//        const plays = require('./plays.json');
//        console.log(plays);  // recommend initially logging the json file to the console to verify that this works with your setup

// Recommend testing with Jest using Node.js
// start with Jest Crash Course/sum.js 
// This is based on 'Jest Crash Course  - Learn How to Test Your JavaScript Application'
//      https://www.youtube.com/watch?v=ajiAl5UNzBU

// testing framework: 
//   test using Jest in Node.js
//   see statement.tests.js
//   either use 
//      Test Explorer UI or
//      in the terminal type
//        'npm run test statement'

// Alternately test in the browser - using Jest, or Mocha, e.g.
//    see 'Write a Unit Test for JavaScript (super simple!) - using Mocha and Chai'Ã‚ https://www.youtube.com/watch?v=Rumf96j0cR0


/* function from Refactor Text */
// create invoice  - need to remove the first square brackets from invoice or change the code the access the first element of invoice
// let invoice = require("./invoice.json") // alternative to reading the .json file is to assign the value in this file
let invoice = 
{
    customer: "BigCo",
    performances: [
        {
            playID: "hamlet",
            audience: 55
        },
        {
            playID: "as-like",
            audience: 35
        },
        {
            playID: "othello",
            audience: 40
        }
   ]
}

function statement(invoice, plays) {
    let totalAmount = 0;
    let volumeCredits = 0;
    let result = `Statement for ${invoice.customer}\n`;
    const format = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
    }).format;
    for (let perf of invoice.performances) {
      const play = plays[perf.playID];
      let thisAmount = 0;
      switch (play.type) {
        case 'tragedy':
          thisAmount = 40000;
          if (perf.audience > 30) {
            thisAmount += 1000 * (perf.audience - 30);
          }
          break;
        case 'comedy':
          thisAmount = 30000;
          if (perf.audience > 20) {
            thisAmount += 10000 + 500 * (perf.audience - 20);
          }
          thisAmount += 300 * perf.audience;
          break;
        default:
          throw new Error(`unknown type: ${play.type}`);
      }
      // add volume credits
      volumeCredits += Math.max(perf.audience - 30, 0);
      // add extra credit for every ten comedy attendees
      if ('comedy' === play.type) volumeCredits += Math.floor(perf.audience / 5);
      // print line for this order
      result += ` ${play.name}: ${format(thisAmount / 100)} (${
        perf.audience
      } seats)\n`;
      totalAmount += thisAmount;
    }
    result += `Amount owed is ${format(totalAmount / 100)}\n`;
    result += `You earned ${volumeCredits} credits\n`;
    return result;
  }
  

// you can either run the statement function directly from this file 
let stmt = statement(invoice, plays)
console.log(stmt)

// or export it  
// module.exports = statement
// run it in another file
// in the other file include the following line at the top
// let statement = require("./statement_v0")