

let calculateSip =  (principle, number_per_year, interest, time_in_years) => {
    let actual_rate = interest / number_per_year / 100;
    let installments = number_per_year * time_in_years;
    calc = principle * Math.pow((1 + actual_rate / number_per_year), number_per_year * time_in_years);
    calc = principle * (Math.pow((1 + actual_rate), installments) - 1) / actual_rate * (1 + actual_rate);
    return calc;
}


let fetchData = async () => {
    let principle = document.getElementById("sipForm").elements.namedItem("principle").value;
    let rate = document.getElementById("sipForm").elements.namedItem("rate").value;
    let years = document.getElementById("sipForm").elements.namedItem("years").value;

    let data = { principle, years, rate };
    console.log(data);
    return data;

}


let drawBarGraph = async (calculated_values) => {
    var densityCanvas = document.getElementById("barChart");
    var densityData = {
        label: 'Expected Value (in Thousand Rs.)',
        backgroundColor: ["#3e95cd", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2"],
        data: calculated_values
    };

    var barChart = new Chart(densityCanvas, {
        type: 'bar',
        data: {
            labels:[5,10,15,20,25,30],
            datasets: [densityData]
        },
        options: {
            scales: {
                xAxes: [{
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,


                }]
            },
        }

    });

};

let putData = async (principle, years, result) => {
    let net_invested = principle*12*years;
    let net_value = result;
    let net_gain = result-net_invested;

    document.getElementById('expected').innerHTML = Math.round(net_value);
    document.getElementById('invested').innerHTML = Math.round(net_invested);
    document.getElementById('gained').innerHTML = Math.round(net_gain);
}

let getResults = async () => {
    let data = await fetchData();
    console.log(data);
    let result = await calculateSip(data.principle, 12, data.rate, data.years);
    let calculation_periods = [5,10,15,20,25,30];
    let calculated_values = calculation_periods.map(time =>  calculateSip(data.principle, 12, data.rate,time)/1000);
    console.log(result);
    console.log(calculated_values);
    await drawBarGraph(calculated_values);
    await putData(data.principle, data.years, result);
};

//window.onload = drawBarGraph;


// window.onload = function() {
//     var ctx = document.getElementById("barChart");
//     var lineChart = new Chart(ctx, {
//       type: 'line',
//       data: {
//         labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
//         datasets: [{
//           label: "2015",
//           data: [10, 8, 6, 5, 12, 8, 16, 17, 6, 7, 6, 10]
//         }]
//       }
//     })
//   }