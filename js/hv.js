
let calculateValue = (principle, cage, rage) => {
    let inflation_rate = 6;
    calc = principle  * Math.pow((1 + inflation_rate / 1200), (rage-cage)*12);
    console.log(calc);
    //calc = principle * (Math.pow((1 + actual_rate), installments) - 1) / actual_rate * (1 + actual_rate);
    return calc;
}


let fetchData = async () => {
    let expense = document.getElementById("sipForm").elements.namedItem("expense").value;
    let cage = document.getElementById("sipForm").elements.namedItem("cage").value;
    let rage = document.getElementById("sipForm").elements.namedItem("rage").value;

    let data = { expense, cage, rage };
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
    let inflated_result = result;
    if (years === 0)
        years =1;
    let nominal_result = principle*years*12;

    //let net_gain = net_invested - result;
    //await drawPieChart(Math.round(principle), Math.round(interest));
    document.getElementById('nominal_cost').innerHTML = "Rs." + approximate(Math.round(nominal_result));
    document.getElementById('inflated_cost').innerHTML = "Rs." + approximate(Math.round(inflated_result));
    //document.getElementById('interest').innerHTML = "Rs." + Math.round(interest);
    //document.getElementById('total').innerHTML = "Rs." + Math.round(total);
}

let getResults = async () => {
    let data = await fetchData();
  //  console.log(data);
    let result = await calculateValue(data.expense, data.cage, data.rage);
    //let calculation_periods = [5, 10, 15, 20, 25, 30];
    //let calculated_values = calculation_periods.map(time => Math.round(calculateLumSum(data.principle, data.rate, time)));
   // console.log(result);
    //console.log(calculated_values);
    //await drawBarGraph(calculated_values);
    await putData(data.expense, data.rage - data.cage, result);
    document.getElementById('result').style.display = "block";
    //document.getElementById('barBanner').innerHTML = "Predictions based on investment of Rs. " + data.principle + " at " + data.rate + "% interest";
};

let approximate = (value) =>  {
    if (value <= 1000) {
        return Math.round(value)
    }
    if (value >= 1000 && value < 100000) {
        return Math.round((value / 1000) * 100) / 100 + "K"
    }
    else if (value >= 100000 && value < 10000000) {
        return Math.round((value / 100000) * 100) / 100 + " Lakhs"
    }
    else if (value >= 10000000) {
        return Math.round((value / 10000000) * 100) / 100 + " Cr"
    }
}