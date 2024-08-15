<script>
  import { onMount } from 'svelte';
  import { budgetStore } from '../stores/budgetstore.js';

  let expenses = [];
  let total = 0;

  // Subscribe to the budgetStore
  budgetStore.subscribe(store => {
      expenses = store.expenses;
      calculateTotal();
  });

  onMount(async () => {
      const response = await fetch('http://localhost:4002/expense');
      if (response.ok) {
          const fetchedExpenses = await response.json();
          budgetStore.update(store => ({
              ...store,
              expenses: fetchedExpenses
          }));
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
  
  <p>Total expenses: ${total}</p>