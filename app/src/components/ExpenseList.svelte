<script>
    import { onMount } from 'svelte';
    let expenses = [];
    let total = 0;
  
    onMount(async () => {
      const response = await fetch('http://localhost:4002/expense');
      if (response.ok) {
        expenses = await response.json();
        calculateTotal();
      }
    });
    function calculateTotal() {
        total = expenses.reduce((sum, expense) => sum + expense.amount, 0);
    }
  </script>
  
  <ul>
    {#each expenses as { amount, category, date }}
      <li>{amount} - {category} - {date}</li>
    {/each}
  </ul>
  
  <p>Total expenses: {total}</p>