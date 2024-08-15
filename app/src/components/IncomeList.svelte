<script>
    import { onMount } from "svelte";
    let incomes = [];
    let total = 0;

    onMount(async () => {
        const response = await fetch("http://localhost:4003/income");
        if (response.ok) {
            incomes = await response.json();
            calculateTotal();
        }
    });
    function calculateTotal() {
        total = incomes.reduce((sum, income) => sum + income.amount, 0);
    }
</script>

<ul>
    {#each incomes as { amount, category, date }}
        <li>{amount} - {category} - {date}</li>
    {/each}
</ul>

<p>Total income: {total}</p>
