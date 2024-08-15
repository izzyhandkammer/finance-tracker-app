<script>
    import { onMount } from 'svelte';
  
    let budgets = [];
  
    onMount(async () => {
      const response = await fetch('http://localhost:4001/budget');
      if (response.ok) {
        budgets = await response.json();
      } else {
        console.error('Failed to fetch budget data');
      }
    });
  </script>
  
  <ul>
    {#each budgets as budget}
      <li>{budget.category}: {budget.amount} on {budget.date}</li>
    {/each}
  </ul>