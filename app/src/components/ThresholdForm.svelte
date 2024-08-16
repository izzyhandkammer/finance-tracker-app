<script>
    import { checkExpenses, budgetStore, setThreshold } from "../stores/budgetstore.js";
    import { onDestroy } from "svelte";
    import { writable } from "svelte/store";

    let thresholdAmount = 0;
    let thresholdPercentage = 0;
    let income = 0; // This will be set from the income data
    let calculatedThreshold = 0;
    let overBudgetAmount = 0;
    let totalExpenses = 0;

    // Retrieve current income from the store
    const unsubscribe = budgetStore.subscribe(store => {
        income = store.income.reduce((acc, entry) => acc + entry.amount, 0);
        totalExpenses = store.totalExpenses;
    });

    onDestroy(() => {
        unsubscribe();
    });

    $: {
        if (income > 0) {
        if (thresholdAmount) {
            calculatedThreshold = parseFloat(thresholdAmount);
            thresholdPercentage = (calculatedThreshold / income) * 100;
        } else if (thresholdPercentage) {
            calculatedThreshold = (income * parseFloat(thresholdPercentage)) / 100;
        } else {
            calculatedThreshold = 0;
        }
        calculatedThreshold = parseFloat(calculatedThreshold.toFixed(2));
        thresholdPercentage = parseFloat(thresholdPercentage.toFixed(2));

        overBudgetAmount = totalExpenses > calculatedThreshold ? totalExpenses - calculatedThreshold : 0;
    }
    }

    async function updateThreshold() {
        setThreshold(calculatedThreshold);
        checkExpenses();
    }

</script>
<h2>Set threshold for expenses</h2>
<form on:submit|preventDefault={updateThreshold}>
    <label>
        Fixed Amount:
        <input type="number" bind:value={thresholdAmount} placeholder="Enter amount" min="0" />
    </label>
    <label>
        Percentage of Income:
        <input type="float" bind:value={thresholdPercentage} placeholder="Enter percentage" min="0" max="100" />
    </label>
    <button type="submit">Set Threshold</button>
</form>

<p>Fixed Amount Threshold: ${thresholdAmount}</p>
<p>Percentage of Income Threshold: {thresholdPercentage}%</p>

{#if $budgetStore.thresholdWarning}
    <p class="warning">{$budgetStore.thresholdWarning}</p>
{/if}

{#if overBudgetAmount > 0}
    <p class="warning">You are over budget by ${overBudgetAmount.toFixed(2)}</p>
{/if}

<style>
    .warning {
        color: red;
    }
</style>
