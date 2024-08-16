<script>
    import { onMount } from "svelte";
    import { budgetStore } from "../stores/budgetstore.js";

    let expenses = [];
    let totalExpenses;

    // Subscribe to the budgetStore
    budgetStore.subscribe((store) => {
        expenses = store.expenses;
        totalExpenses = store.totalExpenses;
        console.log("totalExpenses read in expenselist.svelte", totalExpenses);
    });

    onMount(async () => {
        const response = await fetch("http://localhost:4002/expense");
        if (response.ok) {
            const fetchedExpenses = await response.json();
            budgetStore.update(store => {
            const updatedExpenses = fetchedExpenses;
            const updatedTotalExpenses = updatedExpenses.reduce((sum, expense) => sum + expense.amount, 0);
            return {
                ...store,
                expenses: updatedExpenses,
                totalExpenses: updatedTotalExpenses
            };
        });
        }
    });
</script>

<ul>
    {#each expenses as { amount, category, date }}
        <li>{amount} - {category} - {date}</li>
    {/each}
</ul>

<p>Total expenses: ${totalExpenses}</p>
