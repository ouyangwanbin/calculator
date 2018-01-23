var Calculator = function() {
  this.opArray = [];
  this.valueArray = [];
  this.priArray = [];
};

Calculator.prototype.execute = function() {
  var op = this.opArray.pop();
  var val1 = this.valueArray.pop();
  var val2 = this.valueArray.pop();
  var result = 0;
  switch (op) {
    case "+":
      result = val2 + val1;
      break;
    case "-":
      result = val2 - val1;
      break;
    case "*":
      result = val2 * val1;
      break;
    case "/":
      result = val2 / val1;
      break;
  }
  this.valueArray.push(result);
};

Calculator.prototype.calculate = function(expression) {
  var tokens = this.preprocess(expression);
  if (tokens === false) {
    return;
  }
  if (tokens[0] == "-") {
    tokens.unshift("0");
  }
  var idx = 0,
    pri = 0;
  var len = tokens.length;
  while (idx < len) {
    var tk = tokens[idx];
    if (tk == " ") {
      continue;
    }
    if (this.isNumeric(tk)) {
      var num = 0;
      while (idx < len && this.isNumeric(tokens[idx])) {
        num = 10 * num + Number(tokens[idx]);
        idx++;
      }
      this.valueArray.push(num);
      continue;
    }
    if (tk == "(") {
      pri += 2;
    }
    if (tk == ")") {
      pri -= 2;
    }
    if (tk == "+" || tk == "-" || tk == "*" || tk == "/") {
      var nowPri = pri;
      if (tk == "*" || tk == "/") nowPri++;
      while (
        this.priArray.length != 0 &&
        this.priArray[this.priArray.length - 1] >= nowPri
      ) {
        this.execute();
        this.priArray.pop();
      }
      this.opArray.push(tk);
      this.priArray.push(nowPri);
    }
    idx++;
  }
  while (this.opArray.length > 0) {
    this.execute();
  }
  var result = this.valueArray.length > 0 ? this.valueArray[0]:0;
  this.reset();
  return result;
};

Calculator.prototype.preprocess = function(expression) {
  var tokens = expression.split("");
  var invalidTokens = tokens.filter(
    function(t) {
      return !this.isNumeric(t) && !this.isOperator(t) && !this.isBrackets(t);
    }.bind(this)
  );
  if (invalidTokens.length > 0) {
    console.log("invalid input");
    return false;
  }
  return tokens;
};

Calculator.prototype.reset = function() {
  this.opArray = [];
  this.valueArray = [];
  this.priArray = [];
};

Calculator.prototype.isNumeric = function(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
};

Calculator.prototype.isOperator = function(n) {
  return n === "+" || n === "-" || n === "*" || n === "/";
};

Calculator.prototype.isBrackets = function(n) {
  return n === "(" || n === ")";
};

var calculator = new Calculator();
var formula = document.querySelector("#formula");
var clickHandle = function(ev) {
  var target = ev.target;
  if (target.className === "btn") {
    var val = formula.value;
    var inputVal = target.innerHTML;
    if (inputVal === "Del") {
      formula.value = val.substring(0, val.length - 1);
    } else if (inputVal === "AC") {
      formula.value = "0";
    } else if (inputVal === "=") {
      formula.value = calculator.calculate(val);
    } else {
      if( val === "0" ){
          formula.value = inputVal;  
      }else{
        formula.value = val + inputVal;  
      }
    }
  }
};

document.querySelector(".panel").addEventListener("click", clickHandle);
