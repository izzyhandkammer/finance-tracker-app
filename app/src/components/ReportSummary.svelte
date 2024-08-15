<script>
    import { onMount } from 'svelte';
    import { Chart, registerables } from 'chart.js';
  
    // Register Chart.js components
    Chart.register(...registerables);
  
    let ctx;
    let chartData = {
      labels: [],
      datasets: [
        {
          label: 'Income',
          data: [],
          backgroundColor: 'rgba(75, 192, 192, 0.2)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          fill: false,
        },
        {
          label: 'Expenses',
          data: [],
          backgroundColor: 'rgba(255, 99, 132, 0.2)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 2,
          fill: false,
        }
      ]
    };
  
    onMount(async () => {
      try {
        const response = await fetch('http://localhost:4004/report/monthly');
        const data = await response.json();
  
        chartData.labels = Object.keys(data);
        chartData.datasets[0].data = chartData.labels.map(month => data[month].income);
        chartData.datasets[1].data = chartData.labels.map(month => data[month].expense);
  
        new Chart(ctx, {
          type: 'line',  // Change to 'line' for a line chart
          data: chartData,
          options: {
            responsive: true,
            scales: {
              x: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Month'
                }
              },
              y: {
                beginAtZero: true,
                title: {
                  display: true,
                  text: 'Amount'
                }
              }
            },
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `${context.dataset.label}: ${context.raw}`;
                  }
                }
              }
            }
          }
        });
      } catch (error) {
        console.error('Error fetching trend data:', error);
      }
    });
  </script>
  
  <canvas id="trend-chart" bind:this={ctx}></canvas>
  
  <style>
    canvas {
      max-width: 600px;
      margin: 0 auto;
    }
  </style>
  