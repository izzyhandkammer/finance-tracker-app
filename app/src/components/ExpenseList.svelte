<script>
    import { onMount } from 'svelte';
    let expenses = [];
  
    onMount(async () => {
      const response = await fetch('http://localhost:4002/expense');
      if (response.ok) {
        expenses = await response.json();
      }
    });
  </script>
  
  <ul>
    {#each expenses as { amount, category, date }}
      <li>{amount} - {category} - {date}</li>
    {/each}
  </ul>
  