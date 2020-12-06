document.getElementById("amountAndInterest1").style.display = "none"
document.getElementById("amountAndInterest2").style.display = "none"
document.getElementById("amountAndInterest3").style.display = "none"

// output div is hidden at first, starting date (today) is also hidden, although this should be adjustable in v2.0
document.getElementById("output").style.visibility = "hidden"
document.getElementById("startDate").style.visibility = "hidden"
document.getElementById("startDate").valueAsDate = new Date()


// set up the date variables (wish I could force a minimum of 30 days from today)
function setUpDates(userEnteredDate){
  var freeDat = new Date(userEnteredDate)
  var totalDys = parseInt((freeDat - new Date()) / (1000 * 60 * 60 * 24))
  var months = totalDys / 30.44
  return [freeDat, totalDys, months];
}
// setUpDates(document.getElementById("freedomDate").value)
// var dates = setUpDates();

// var freeDat2 = setUpDates()[0]
console.log(setUpDates()[0] + ' should be users date');
var totalDys = setUpDates()[1]
var months = setUpDates()[2]

// initialize an array to hold all the debts info
var debtArray = [[0,0],[0,0],[0,0],[0,0]];

// event of clicking yellow plus sign to add up to 3 other debt inputs
document.getElementById("plus-sign").onclick = function() {
  if (document.getElementById("amountAndInterest1").style.display == "none") {
    document.getElementById("amountAndInterest1").style.display = "block"
  } else if (
    document.getElementById("amountAndInterest2").style.display == "none"
  ) {
    document.getElementById("amountAndInterest2").style.display = "block"
  } else {
    document.getElementById("amountAndInterest3").style.display = "block"
  }
}

// event of clicking yellow minus sign to remove 3 other debt inputs
document.getElementById("minus-sign1").onclick = function minus1() {
  if (document.getElementById("amountAndInterest1").style.display == "block") {
    document.getElementById("amountAndInterest1").style.display = "none"
  }
}

document.getElementById("minus-sign2").onclick = function minus2() {
  if (document.getElementById("amountAndInterest2").style.display == "block") {
    document.getElementById("amountAndInterest2").style.display = "none"
  }
}

document.getElementById("minus-sign3").onclick = function minus3() {
  if (document.getElementById("amountAndInterest3").style.display == "block") {
    document.getElementById("amountAndInterest3").style.display = "none"
  }
}


// The main function:
function calc() {
  var totalDys = setUpDates(document.getElementById("freedomDate").value)[1];
  var months = setUpDates(document.getElementById("freedomDate").value)[2];
  
  var debtInputs = document.getElementsByClassName('debts');
  var rateInputs = document.getElementsByClassName('rates');
  for (i = 0; i < debtInputs.length; i ++){
    debtArray[i] = [debtInputs[i].value, rateInputs[i].value];
  }
  console.log("debtArray...")
  console.log(debtArray)
  


  // reveal the output divs
  document.getElementById("output").style.visibility = "visible"

  // The amortization? formula -- '|| 0' avoids displaying "NaN" before the user can enter both values
  function xtraCalc(d, r) {
    
    const xtraIntr = r.value || 0
    const rt = xtraIntr / 12 / 100

    const dbt = d.value || 0

    const monthlyPay =
      parseFloat((rt * dbt) / (1 - Math.pow(1 + rt, -months))) || 0

    return monthlyPay.toFixed(2)
  }

  // outputs the possible side gigs advice elements under each monthly payment. to-do: store as nested objects
  function planOutput(anyDebt, anyRate){
    var advice = [];
    if((xtraCalc(anyDebt, anyRate) !== 0) && (xtraCalc(anyDebt, anyRate) > 0)){
    advice = [
      xtraCalc(anyDebt, anyRate),  
      "- That's about " + (xtraCalc(anyDebt, anyRate) / 5).toFixed(2) + " hrs of online surveys ", 
    (xtraCalc(anyDebt, anyRate) / 10).toFixed(2) + " hrs of teaching english ", 
    "or " + (xtraCalc(anyDebt, anyRate) / 16).toFixed(2) + " hours of Lyft driving."
  ]}else{
    advice = "";
  }   
    console.log("advice " + xtraCalc(anyDebt, anyRate))
    return advice
  }

  // output the first debt payment
  console.log(debt1.value + " DEBT!");
  document.getElementById("monthlyPayOutput").innerHTML = "Debt 1: " + planOutput(debt1, rate1)[0];
    

  // The bottom three days/months/years output divs:
  document.getElementById("numdays").innerHTML = totalDys
  document.getElementById("numMonths").innerHTML = months.toFixed(2)
  document.getElementById("numYears").innerHTML = (months / 12).toFixed(2)

  // if any additional debts are added (made visible,) append to results div with the calculation
  // add modal with grand total, payoff plan 
  if (document.getElementById("amountAndInterest1").style.display == "block") {
    var para1 = document.createElement("p")
    para1.className = "card bg-warning mb-2"
    document.getElementById("monthlyPayOutput").appendChild(para1)
    document.getElementsByClassName("card bg-warning mb-2")[1].innerHTML = "Debt 2: " + planOutput(debt2, rate2)[0]
  } else {
    var para1 = document.createElement("p")
    para1.className = "card bg-warning mb-2"
    document.getElementById("monthlyPayOutput").appendChild(para1)
    document.getElementsByClassName("card bg-warning mb-2")[1].innerHTML =
      "click + / - to enter/remove more debts"
  }

  if ((document.getElementById("amountAndInterest2").style.display == "block") && planOutput(debt3, rate3)[0] > 0) {
    var para1 = document.createElement("p")
    para1.className = "card bg-warning mb-2"
    document.getElementById("monthlyPayOutput").appendChild(para1)
    document.getElementsByClassName("card bg-warning mb-2")[2].innerHTML = "Debt 3: " + planOutput(debt3, rate3)[0];
  }

  if ((document.getElementById("amountAndInterest3").style.display == "block") && planOutput(debt4, rate4)[0] > 0) {
    var para1 = document.createElement("p")
    para1.className = "card bg-warning mb-2"
    document.getElementById("monthlyPayOutput").appendChild(para1)
    document.getElementsByClassName("card bg-warning mb-2")[3].innerHTML = "Debt 4: " + planOutput(debt4, rate4)[0];
  }
  let adviceArr = [planOutput(debt1, rate1), planOutput(debt2, rate2), planOutput(debt3, rate3), planOutput(debt4, rate4)];
  return adviceArr;

};

// listen for any inputs and recalculate
var inputs = document.querySelectorAll("input")
inputs.forEach(inp => {
  inp.addEventListener("input", calc)
  setUpDates();
  console.log(months.toFixed(2) + ' should be months')
});

// listen for minus sign clicks
var minus = document.getElementsByClassName("minus-sign")
for (var i = 0; i < minus.length; i++) {
  minus[i].addEventListener("click", function(event){
    // for the debt/interest rate corresponding to whichever minus symbol was clicked, reset value to zero.
    // this will break if anything is added to the HTML form, so might be better to place inside lines 42-59
    console.log("hey minus");
    event.target.parentElement.firstElementChild.value = 0;
    event.target.parentElement.childNodes[3].value = 0;

  })
  minus[i].addEventListener("click", calc)
};

// listen for plus sign clicks
var plus = document.getElementById("plus-sign");
plus.addEventListener("click", calc);

// next steps: total up the debts, if more than 1 (maybe value || 0), in the modal. Maybe a pie chart divided evenly with each radio checked
// totalDebts = ( debt0 || 0) + ( debt1 || 0) + (debt2 || 0) + (debt3 || 0)
// payoffPlan innerHTML = "To pay off " (totalDebts) + " by " + (user's chosen date) + ":"
// planDetail  