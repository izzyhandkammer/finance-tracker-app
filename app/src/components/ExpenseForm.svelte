<script>
    import { addExpense } from "../stores/budgetstore.js";

    let amount = "";
    let category = "";
    let date = "";

    let successMessage = "";
    let errorMessage = "";

    async function submitExpense() {
        try {
            const response = await fetch("http://localhost:4002/expense", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ amount, category, date }),
            });

            if (response.ok) {
                const newExpense = await response.json();
                successMessage = "Income added successfully!";

                // Update store with the new income entry
                addExpense(newExpense);

                // Clear form fields after successful submission
                amount = "";
                category = "";
                date = "";

                // Clear the success message after a few seconds
                setTimeout(() => {
                    successMessage = "";
                }, 3000);
            } else {
                throw new Error("Failed to add expense");
            }
        } catch (error) {
            errorMessage = error.message;

            // Clear the error message after a few seconds
            setTimeout(() => {
                errorMessage = "";
            }, 3000);
        }
    }
</script>

<form on:submit|preventDefault={submitExpense}>
    <input type="number" bind:value={amount} placeholder="Amount" required />
    <input type="text" bind:value={category} placeholder="Category" required />
    <input type="date" bind:value={date} required />
    <button type="submit">Add Expense</button>
</form>

{#if successMessage}
    <p class="success">{successMessage}</p>
{/if}

{#if errorMessage}
    <p class="error">{errorMessage}</p>
{/if}

<style>
  .success {
    color: green;
  }
  .error {
    color: red;
  }
</style>