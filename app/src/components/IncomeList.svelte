<script>
  import { onMount } from 'svelte';
  import { budgetStore } from '../stores/budgetstore.js';

  let incomes = [];
  let total = 0;

  // Subscribe to the budgetStore
  budgetStore.subscribe(store => {
      incomes = store.income; // store.income is treated as an array of income entries
      calculateTotal();
  });

  onMount(async () => {
      const response = await fetch('http://localhost:4003/income');
      if (response.ok) {
          const fetchedIncome = await response.json();
          budgetStore.update(store => ({
              ...store,
              income: fetchedIncome // Store fetched income as an array
          }));
      }
  });

  function calculateTotal() {
      total = incomes.reduce((sum, income) => sum + income.amount, 0);
  }
</script>

<ul>
  {#each incomes as income}
      <li>{income.category}: ${income.amount} on {income.date}</li>
  {/each}
</ul>
<p>Total Income: ${total}</p>
