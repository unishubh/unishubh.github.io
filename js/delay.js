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
    let reduction_months = document.getElementById("sipForm").elements.namedItem("delay").value;

    let data = { principle, years, rate, reduction_months };
    console.log(data);
    return data;

}

let getResultsForDelay = async () => {
    let data = await fetchData();
    let actual_result = await calculateSip(data.principle, 12, data.rate, data.years);
    let delayed_result = await calculateSip(data.principle, 12, data.rate, data.years, data.reduction_months);
    let calculation_periods = [5, 10, 15, 20, 25, 30];
    let actual_calculated_values = calculation_periods.map(time => Math.round(calculateSip(data.principle, 12, data.rate, time)));
    let delayed_calculated_values = calculation_periods.map(time => Math.round(calculateSip(data.principle, 12, data.rate, time, data.reduction_months)));

    console.table(actual_result, delayed_result);
    console.log(actual_calculated_values);
    console.log(delayed_calculated_values);
   // let words=inWords(Math.round(result));
    await putDataInTable(actual_calculated_values, delayed_calculated_values,calculation_periods);
    await putData(data.principle, data.years, actual_result,delayed_result);
    await drawBarGraph(actual_calculated_values, delayed_calculated_values);
    document.getElementById('barBanner').innerHTML = "Calculations based on investment of Rs. "+data.principle+" at "+data.rate+"% return";

    document.getElementById('result').style.display = "block";

}

let putDataInTable = async (actual_data, delay_data, calculation_periods) => {
    //let l = data.length
    let table = document.getElementById('futurePredictions')
    table.innerHTML='';
    actual_data.map((i,d)=>{ insetIntoTable(i,delay_data[d], calculation_periods[d], table,d)});

}

let insetIntoTable =  (real_value,delay_value,time, table,index) => {
    let row = table.insertRow(index)
    let timeCell = row.insertCell(0)
    let actualValueCell = row.insertCell(1)
    let delayValueCell = row.insertCell(2)
    let lossCell = row.insertCell(3)
    timeCell.innerHTML=time+" yrs"
    actualValueCell.innerHTML=approximate(real_value)
    delayValueCell.innerHTML=approximate(delay_value)
    lossCell.innerHTML=approximate(real_value- delay_value)

}

let putData = async (principle, years, actual_result, delay_result) => {
    let net_invested = principle * 12 * years;
    let delay_net_invested = principle * (12 * years);
    let net_value = actual_result;
    let delay_net_value = delay_result;
    let net_gain = actual_result - net_invested;
    let delay_net_gain = delay_result -net_invested;
    console.log(delay_result, actual_result, delay_net_gain);
   // await drawPieChart(Math.round(net_invested), Math.round(net_gain));
    document.getElementById('expected').innerHTML = "Rs. " + numberWithCommas(Math.round(net_value)) + " ( "+approximate(net_value) + " )";
    document.getElementById('invested').innerHTML = "Rs. " + numberWithCommas(Math.round(net_invested))+ " ( "+approximate(net_invested) + " )";
    document.getElementById('gained').innerHTML = "Rs. " + numberWithCommas(Math.round(net_gain))+ " ( "+approximate(net_gain) + " )";

    document.getElementById('expectedwithDelay').innerHTML = "Rs. " + numberWithCommas(Math.round(delay_net_value)) + " ( "+approximate(delay_net_value) + " )";
    document.getElementById('investedWithDelay').innerHTML = "Rs. " + numberWithCommas(Math.round(net_invested))+ " ( "+approximate(net_invested) + " )";
    document.getElementById('gainedWithDelay').innerHTML = "Rs. " + numberWithCommas(Math.round(delay_net_gain))+ " ( "+approximate(delay_net_gain) + " )";

    document.getElementById('gainLoss').innerHTML = "Rs. " + numberWithCommas(Math.round(net_gain - delay_net_gain)) + " ( "+approximate(net_gain - delay_net_gain) + " )";
    document.getElementById('totalLoss').innerHTML = "Rs. " + numberWithCommas(Math.round(net_gain - delay_net_gain))+ " ( "+approximate(net_gain - delay_net_gain) + " )";



}

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

let drawBarGraph = async (actual_values, delay_values) => {
    let densityCanvas = document.getElementById("barChart");
    let actualDensityData = {

        label: 'Expected Value Without Delay',
        backgroundColor: 'rgba(125,211,222,0.5)',//["#ccddee", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2"],
        data: actual_values,
        fillColor:"transparent",
    };
    let delayDensityData = {
        label: 'Expected Value With Delay',
        backgroundColor: 'rgb(123,130,131)',//["#ccddee", "#8e5ea2", "#3cba9f", "#e8c3b9", "#c45850", "#3e95cd", "#8e5ea2"],
        data: delay_values
    }

    var barChart = new Chart(densityCanvas, {
        type: 'line',
        //fillOpacity: .9,
        data: {
            labels: ['5 yrs', '10 yrs', '15 yrs', '20 yrs', '25 yrs', '30 yrs'],
            datasets: [actualDensityData,delayDensityData]
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
                    display: true,
                    ticks : {
                        callback: function (value) {
                            return approximate(value);
                        }
                    }

                }],
            },

            plugins: {
                datalabels: {
                    display: false,
                }
            }
        }

    });

};