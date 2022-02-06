import React from 'react';
import {Line} from 'react-chartjs-2';

/**
 * Render line graph showing sales for an incoming product
 * 
 * @param {incoming} dictionary 
 * @returns SalesProductGraph
 */
function SalesProductGraph(incoming) {

  console.log(incoming);
  var chartData = {
      labels: [],
      datasets: [
        {
          label: 'Total daily sales',
          data: [],
          fill: false,
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgba(255, 99, 132, 0.2)',
      },
    ],
  };
  // Load product sales data
  if (incoming.incoming !== undefined) {
    chartData = {
        labels: incoming.incoming.labels,
        datasets: [
          {
            label: 'Total daily sales',
            data: incoming.incoming.data,
            fill: false,
            backgroundColor: 'rgb(255, 99, 132)',
            borderColor: 'rgba(255, 99, 132, 0.2)',
        },
      ],
    };
  }

  // Return line graph
  return (
    <div>
      <h2 id='header2'>Sales Product Overview</h2>
      <Line 
        data={chartData}
        options={{
            legend:{display:true, position:'right'},
            maintainAspectRatio: true,
        }}
      
        style={{backgroundColor:'#fff'}}
      />
    </div>
  );
}

export default SalesProductGraph;