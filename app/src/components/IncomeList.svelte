<script>
    import { onMount } from 'svelte';
    let incomes = [];
  
    onMount(async () => {
      const response = await fetch('http://localhost:4003/income');
      if (response.ok) {
        incomes = await response.json();
      }
    });
  </script>
  
  <ul>
    {#each incomes as { amount, category, date }}
      <li>{amount} - {category} - {date}</li>
    {/each}
  </ul>
  