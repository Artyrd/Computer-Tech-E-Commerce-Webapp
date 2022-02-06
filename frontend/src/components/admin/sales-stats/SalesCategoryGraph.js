import React from 'react';
import {Line} from 'react-chartjs-2';

/**
 * Render a line graph showing sales for an incoming category
 * 
 * @param {incoming} dictionary 
 * @returns SalesCategoryGraph
 */
function SalesCategoryGraph(incoming) {
    
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
    // Load category data
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
          <h2 id='header2'>Sales Category Overview</h2>
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

export default SalesCategoryGraph;