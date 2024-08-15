<script>
    import { onMount } from 'svelte';
    import { Pie } from 'svelte-chartjs';
    import 'chart.js/auto';
  
    let chartData = { labels: [], datasets: [] };
  
    onMount(async () => {
      const incomeResponse = await fetch('http://localhost:4001/income');
      const expenseResponse = await fetch('http://localhost:4002/expense');
  
      if (incomeResponse.ok && expenseResponse.ok) {
        const incomes = await incomeResponse.json();
        const expenses = await expenseResponse.json();
  
        // Process data for the pie chart
        chartData = {
          labels: ['Income', 'Expenses'],
          datasets: [
            {
              data: [
                incomes.reduce((sum, { amount }) => sum + amount, 0),
                expenses.reduce((sum, { amount }) => sum + amount, 0)
              ],
              backgroundColor: ['#36A2EB', '#FF6384']
            }
          ]
        };
      }
    });
  </script>
  
  <Pie {chartData} />
  