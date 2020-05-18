const readline = require("readline");

const input = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

input.clear = () => {
  process.stdout.write("\u001B[2J\u001B[0;0f");
};

module.exports = input;
