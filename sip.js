var a = ['','One ','Two ','Three ','Four ', 'Five ','Six ','Seven ','Eight ','Nine ','Ten ','Eleven ','Twelve ','Thirteen ','Fourteen ','Fifteen ','Sixteen ','Seventeen ','Eighteen ','Nineteen '];
var b = ['', '', 'Twenty','Thirty','Forty','Fifty', 'Sixty','Seventy','Eighty','Ninety'];

function inWords (num) {
    if ((num = num.toString()).length > 9) return 'More than 10 Crore';
    n = ('000000000' + num).substr(-9).match(/^(\d{2})(\d{2})(\d{2})(\d{1})(\d{2})$/);
    if (!n) return; var str = '';
    str += (n[1] != 0) ? (a[Number(n[1])] || b[n[1][0]] + ' ' + a[n[1][1]]) + 'crore ' : '';
    str += (n[2] != 0) ? (a[Number(n[2])] || b[n[2][0]] + ' ' + a[n[2][1]]) + 'lakh ' : '';
    str += (n[3] != 0) ? (a[Number(n[3])] || b[n[3][0]] + ' ' + a[n[3][1]]) + 'thousand ' : '';
    str += (n[4] != 0) ? (a[Number(n[4])] || b[n[4][0]] + ' ' + a[n[4][1]]) + 'hundred ' : '';
    str += (n[5] != 0) ? ((str != '') ? 'and ' : '') + (a[Number(n[5])] || b[n[5][0]] + ' ' + a[n[5][1]]) + 'only ' : '';
    return str;
}

function numberWithCommas(x) {
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

let calculateSip = (principle, number_per_year, interest, time_in_years, reduction_months =0 ) => {
    let actual_rate = interest / number_per_year / 100;
    let installments = (number_per_year * time_in_years) - reduction_months;
    calc = principle * Math.pow((1 + actual_rate / number_per_year), installments);
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

let drawPieChart = async (expected, gained) => {
    let data = {
        datasets: [{
            data: [expected, gained],
            backgroundColor: ["rgba(151,210,224,1)", "rgba(124,126,126,1)"]
        }],
        labels: ['Invested', 'Gained']
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
        animation: true,
        animationEasing: 'easeInOutQuart',
        animationSteps: 80,
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
        plugins:plugins
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
    let net_invested = principle * 12 * years;
    let net_value = result;
    let net_gain = result - net_invested;
    await drawPieChart(Math.round(net_invested), Math.round(net_gain));
    document.getElementById('expected').innerHTML = "Rs. " + numberWithCommas(Math.round(net_value)) + " ( "+approximate(net_value) + " )";
    document.getElementById('invested').innerHTML = "Rs. " + numberWithCommas(Math.round(net_invested))+ " ( "+approximate(net_invested) + " )";
    document.getElementById('gained').innerHTML = "Rs. " + numberWithCommas(Math.round(net_gain))+ " ( "+approximate(net_gain) + " )";
}

let getResults = async () => {
    let data = await fetchData();
    console.log(data);
    let result = await calculateSip(data.principle, 12, data.rate, data.years);
    let calculation_periods = [5, 10, 15, 20, 25, 30];
    let calculated_values = calculation_periods.map(time => Math.round(calculateSip(data.principle, 12, data.rate, time)));
    console.log(result);
    let words=inWords(Math.round(result));

    console.log(calculated_values);
    await putDataInTable(calculated_values,calculation_periods);
    await drawBarGraph(calculated_values);
    await putData(data.principle, data.years, result);
    document.getElementById('inwords').innerHTML="Total Corpus : "+words
    document.getElementById('result').style.display = "block";
    document.getElementById('barBanner').innerHTML = "Calculations based on investment of Rs. "+data.principle+" at "+data.rate+"% return";
};


let approximate = (value) =>  {
    if (value < 1000) {
        return "<1000"
    }
    if (value >= 1000 && value < 100000) {
        return Math.round((value / 1000) * 100) / 100 + "K"
    }
    else if (value >= 100000 && value < 10000000) {
        return Math.round((value / 100000) * 100) / 100 + " L"
    }
    else if (value > 10000000) {
        return Math.round((value / 10000000) * 100) / 100 + " Cr"
    }
}

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
