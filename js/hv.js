
let calculateValue = (principle, cage, rage) => {
    let inflation_rate = 6;
    let actual_rate = inflation_rate / 12 / 100;
    let installments = (rage - cage)*12;
    // calc = principle  * Math.pow((1 + (inflation_rate / 12)), (rage-cage)*12);
    // console.log(calc);
    calc = principle * (Math.pow((1 + actual_rate), installments) - 1) / actual_rate * (1 + actual_rate);
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
            backgroundColor: ["rgba(151,210,224,1)", "rgba(124,126,126,1)"]
        }],
        labels: ['Nominal', 'Inflated']
    };

    let plugins = {
        datalabels: {
            color: "black",
            formatter: function (value, context) {
                if (value >= 1000 && value < 100000) {
                    return Math.round((value / 1000) * 100) / 100 + "K"
                }
                else if (value >= 100000 && value < 10000000) {
                    return Math.round((value / 100000) * 100) / 100 + " L"
                }
                else if (value > 10000000) {
                    return Math.round((value / 10000000) * 100) / 100 + " Cr"
                }
            },
            font: {
                weight: 'normal',
                size: 12,
            }
        }
    };
    let options = {
        responsive: true,
        title: {
            display: true,
            position: "top",
            text: "Total corpus by end of period",
            fontSize: 12,
            fontColor: "#111"
        },
        legend: {
            display: true,
            position: "bottom",
            labels: {
                fontColor: "#333",
                fontSize: 12
            }
        },
        plugins: plugins,
    };
    let ctx = document.getElementById("pieChart");
    var myPieChart = new Chart(ctx, {
        type: 'pie',
        data: data,
        options: options,
        plugins: plugins,
    });

}

let putData = async (principle, years, result) => {
    let inflated_result = result;
    if (years === 0)
        years =1;
    let nominal_result = principle*years*12;

    //let net_gain = net_invested - result;
    await drawPieChart(Math.round(nominal_result), Math.round(inflated_result-nominal_result));
    document.getElementById('nominal_cost').innerHTML = "Rs." + approximate(Math.round(nominal_result));
    document.getElementById('inflated_cost').innerHTML = "Rs." + approximate(Math.round(inflated_result));
    //document.getElementById('interest').innerHTML = "Rs." + Math.round(interest);
    //document.getElementById('total').innerHTML = "Rs." + Math.round(total);
}

let getResults = async () => {
    let data = await fetchData();
  //  console.log(data);
    let result = await calculateValue(data.expense, data.cage, data.rage);
    console.log(result);
    let calculation_periods = [5, 10, 15, 20, 25, 30];
    let calculated_values = calculation_periods.map(time => Math.round(calculateValue(data.expense, 0, time)));
   // console.log(result);
    console.log(calculated_values);
   // await drawBarGraph(calculated_values);
    await putData(data.expense, data.rage - data.cage, result);
   // await putDataInTable(calculated_values,calculation_periods);
    document.getElementById('result').style.display = "block";
    document.getElementById('barBanner').innerHTML = "Calculations based on monthly expense of Rs. " + data.expense + " at " + 6 + "% inflation";
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

let drawBarGraph = async (calculated_values) => {
    let densityCanvas = document.getElementById("barChart");
    let densityData = {
        label: 'Expected Value',
        backgroundColor: 'rgba(151,210,224,1)',//["#ccddee", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2"],
        data: calculated_values
    };

    var barChart = new Chart(densityCanvas, {
        type: 'line',
        data: {
            labels: ['5 yrs', '10 yrs', '15 yrs', '20 yrs', '25 yrs', '30 yrs'],
            datasets: [densityData]
        },
        options: {
            tooltips: {
                callbacks: {
                    label: function(tooltipItem) {
                        return   approximate(tooltipItem.yLabel)
                    }
                }
            },
            scales: {
                xAxes: [{
                    display: true,
                    barPercentage: 1.0,
                    categoryPercentage: 1.0,
                    labelString : "Difference"

                }],
                yAxes : [{
                    display: false,
                }],
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
                        weight: 'normal'
                    },
                    formatter: function (value, context) {
                        if (value >= 1000 && value < 100000) {
                            return Math.round((value / 1000) * 100) / 100 + "K"
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


let putDataInTable = async (data, calculation_periods) => {
    let l = data.length
    let table = document.getElementById('futurePredictions')
    table.innerHTML='';
    data.map((i,d)=>{ insetIntoTable(i, calculation_periods[d], table,d)});

}

let insetIntoTable =  (value,time, table,index) => {
    let row = table.insertRow(index)
    let timeCell = row.insertCell(0)
    let valueCell = row.insertCell(1)
    timeCell.innerHTML=time+" yrs"
    valueCell.innerHTML=approximate(value)
}