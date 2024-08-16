<script>
  export let data = {};  // Expect data to be passed as a prop
  import { onDestroy, onMount } from 'svelte';
  import { Chart, registerables } from 'chart.js';

  // Register all necessary components
  Chart.register(...registerables);

  let ctx;
  let chart;

  onMount(() => {
    // Initialize the chart
    chart = new Chart(ctx, {
      type: 'pie',
      data: data,
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'top',
          },
          tooltip: {
            callbacks: {
              label: (context) => {
                let label = context.dataset.label || '';
                if (label) {
                  label += ': ';
                }
                if (context.parsed !== null) {
                  label += `$ ${context.parsed}`;
                }
                return label;
              }
            }
          }
        }
      }
    });

    // Cleanup the chart instance when component is destroyed
    onDestroy(() => {
      chart.destroy();
    });
  });

  $: {
    // Update chart data when the `data` prop changes
    if (chart) {
      chart.data = data;
      chart.update();
    }
  }
</script>

<canvas id="pie-chart" bind:this={ctx}></canvas>

<style>
  canvas {
    max-width: 400px;
    margin: 0 auto;
  }
</style>
