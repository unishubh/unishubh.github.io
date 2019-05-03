
let calculateEmi = (principle, interest, time_in_years) => {
    //time_in_years = time_in_years * 12;
    interest = interest / 12;
    den = Math.pow((1 + interest / 100), time_in_years * 12) - 1;
 //   console.log("den", den);
    calc = principle * interest/100 * Math.pow((1 + interest / 100), time_in_years * 12) / den;
   // console.log(calc);
    //calc = principle * (Math.pow((1 + actual_rate), installments) - 1) / actual_rate * (1 + actual_rate);
    return calc;
}


let fetchData = async () => {
    let principle = document.getElementById("sipForm").elements.namedItem("principle").value;
    let rate = document.getElementById("sipForm").elements.namedItem("rate").value;
    let years = document.getElementById("sipForm").elements.namedItem("years").value;

    let data = { principle, years, rate };
   // console.log(data);
    return data;

}

let drawPieChart = async (expected, gained) => {
    let data = {
        datasets: [{
            data: [expected, gained],
            backgroundColor: ["rgba(210, 77, 87, 1)", "rgba(46, 204, 113, 1)"]
        }],
        labels: ['Priniciple', 'Interest']
    };

    let options = {
        responsive: true,
        title: {
            display: true,
            position: "top",
            text: "Pie Chart",
            fontSize: 18,
            fontColor: "#111"
        },
        legend: {
            display: true,
            position: "bottom",
            labels: {
                fontColor: "#333",
                fontSize: 16
            }
        }
    };

    let ctx = document.getElementById("pieChart");
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,

    });

}

let putData = async (principle, years, result) => {
    let total = result * years * 12;
    let interest = total - principle;
    //let net_gain = net_invested - result;
    await drawPieChart(Math.round(principle), Math.round(interest));
    document.getElementById('emi').innerHTML = "Rs." + Math.round(result);
    document.getElementById('interest').innerHTML = "Rs." + Math.round(interest);
    document.getElementById('total').innerHTML = "Rs." + Math.round(total);
}

let getResults = async () => {
    let data = await fetchData();
  //  console.log(data);
    let result = await calculateEmi(data.principle, data.rate, data.years);
    //let calculation_periods = [5, 10, 15, 20, 25, 30];
    //let calculated_values = calculation_periods.map(time => Math.round(calculateLumSum(data.principle, data.rate, time)));
   // console.log(result);
    //console.log(calculated_values);
    //await drawBarGraph(calculated_values);
    await putData(data.principle, data.years, result);
    document.getElementById('result').style.display = "block";
    //document.getElementById('barBanner').innerHTML = "Predictions based on investment of Rs. " + data.principle + " at " + data.rate + "% interest";
};