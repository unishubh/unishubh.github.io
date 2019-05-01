

let calculateSip = (principle, number_per_year, interest, time_in_years) => {
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
    let densityCanvas = document.getElementById("barChart");
    let densityData = {
        label: 'Expected Value',
        backgroundColor: 'rgba(25, 181, 254, 1)',//["#ccddee", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2"],
        data: calculated_values
    };

    var barChart = new Chart(densityCanvas, {
        type: 'bar',
        data: {
            labels: [5, 10, 15, 20, 25, 30],
            datasets: [densityData]
        },
        options: {
            scales: {
                xAxes: [{
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,


                }]
            },

            plugins: {
                datalabels: {
                    color: 'black',
                    align: 'end',
                    display: function (context) {
                        console.log("Algo: " + context);
                        return context.dataset.data[context.dataIndex] > 15;
                    },
                    font: {
                        weight: 'bold'
                    },
                    formatter: function (value, context) {
                        if (value >= 1000 && value < 100000) {
                            return Math.round((value / 1000) * 100) / 100 + "Th"
                        }
                        else if (value >= 100000 && value < 10000000) {
                            return Math.round((value / 100000) * 100) / 100 + "L"
                        }
                        else if (value > 10000000) {
                            return Math.round((value / 10000000) * 100) / 100 + "Cr"
                        }
                    }
                }
            }
        }

    });

};

let drawPieChart = async (expected, gained) => {
    let data = {
        datasets: [{
            data: [expected, gained],
            backgroundColor: ["rgba(210, 77, 87, 1)", "rgba(46, 204, 113, 1)"]
        }],
        labels: ['Invested', 'Gained']
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
    let net_invested = principle * 12 * years;
    let net_value = result;
    let net_gain = result - net_invested;
    await drawPieChart(Math.round(net_invested), Math.round(net_gain));
    document.getElementById('expected').innerHTML = "Rs." + Math.round(net_value);
    document.getElementById('invested').innerHTML = "Rs." + Math.round(net_invested);
    document.getElementById('gained').innerHTML = "Rs." + Math.round(net_gain);
}

let getResults = async () => {
    let data = await fetchData();
    console.log(data);
    let result = await calculateSip(data.principle, 12, data.rate, data.years);
    let calculation_periods = [5, 10, 15, 20, 25, 30];
    let calculated_values = calculation_periods.map(time => Math.round(calculateSip(data.principle, 12, data.rate, time)));
    console.log(result);
    console.log(calculated_values);
    await drawBarGraph(calculated_values);
    await putData(data.principle, data.years, result);
    document.getElementById('result').style.display = "block";
    document.getElementById('barBanner').innerHTML = "Predictions based on investment of Rs. "+data.principle+" at "+data.rate+"% interest";
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